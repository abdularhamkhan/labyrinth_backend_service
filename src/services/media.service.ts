import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { redis as redisClient } from "../config/redis";
import { createError, EXTERNAL_SERVICE_ERRORS, VALIDATION_ERRORS } from "../constants/error";
import { logger, isError } from '../utils/logger';
import { 
  MediaCategory, 
  MediaType, 
  MediaUploadResult,
  MediaMetadata,
  MediaQuery,
  MediaStats,
  MediaDeletionRequest,
  FileUploadRequest,
  MultipleFileUploadRequest,
  MediaUploadOptions,
  ProcessingJob
} from "../schemas/media.schema";
import { MEDIA_VALIDATION_RULES } from "../types/media.types";
import { kafkaProducer } from "./kafka-producer.service";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";

/**
 * =============================================================================
 * MEDIA MANAGEMENT SERVICE - SUPABASE STORAGE
 * =============================================================================
 * 
 * Comprehensive media management service using Supabase Storage for the 
 * Labyrinth collaboration platform. Handles all media operations including:
 * 
 * - User avatars
 * - Project images and files
 * - Chat media (images, videos, audio)
 * - Workspace banners
 * - System assets
 * 
 * Features:
 * - Multi-category media support
 * - File validation and processing
 * - Metadata management with Prisma
 * - Redis caching for performance
 * - Kafka events for real-time updates
 * - Comprehensive error handling
 * - Storage optimization
 * 
 * =============================================================================
 */

// Storage bucket names
const MEDIA_BUCKETS = {
  user_avatar: 'user-avatars',
  project_image: 'project-images', 
  chat_media: 'chat-media',
  project_file: 'project-files',
  workspace_banner: 'workspace-banners',
  system_asset: 'system-assets'
} as const;

// Cache keys
const CACHE_KEYS = {
  mediaMetadata: (id: string) => `media:metadata:${id}`,
  mediaStats: (userId: string) => `media:stats:${userId}`,
  mediaThumbnail: (id: string) => `media:thumbnail:${id}`,
  mediaList: (userId: string, category?: string) => `media:list:${userId}:${category || 'all'}`
};

// Cache TTL (in seconds)
const CACHE_TTL = {
  metadata: 3600, // 1 hour
  stats: 1800, // 30 minutes
  thumbnail: 7200, // 2 hours
  list: 900 // 15 minutes
};

/**
 * Initialize all media storage buckets
 */
export const initializeMediaBuckets = async (): Promise<void> => {
  try {
    const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: listError });
    }

    const existingBucketNames = existingBuckets?.map(bucket => bucket.name) || [];

    // Create missing buckets
    for (const [category, bucketName] of Object.entries(MEDIA_BUCKETS)) {
      if (!existingBucketNames.includes(bucketName)) {
        const validationRule = MEDIA_VALIDATION_RULES[category as MediaCategory];
        
        const { error: bucketCreateError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: validationRule.maxSize,
          allowedMimeTypes: validationRule.allowedTypes
        });

        if (bucketCreateError) {
          logger.error(`Failed to create bucket ${bucketName}:`, bucketCreateError);
          throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: bucketCreateError });
        }

        logger.info(`Created media bucket: ${bucketName}`);
      }
    }

    logger.info('All media buckets initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize media buckets:', isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Validate file against category rules
 */
const validateFile = (
  file: Buffer,
  filename: string,
  mimeType: string,
  category: MediaCategory
): void => {
  const rules = MEDIA_VALIDATION_RULES[category];
  
  // File size validation
  if (file.length > rules.maxSize) {
    throw createError(VALIDATION_ERRORS.FILE_TOO_LARGE, {
      maxSize: rules.maxSize,
      actualSize: file.length
    });
  }

  // MIME type validation
  const isAllowedType = rules.allowedTypes.some(allowedType => {
    if (allowedType.endsWith('/*')) {
      return mimeType.startsWith(allowedType.replace('/*', '/'));
    }
    return mimeType === allowedType;
  });

  if (!isAllowedType) {
    throw createError(VALIDATION_ERRORS.INVALID_FILE_TYPE, {
      allowedTypes: rules.allowedTypes,
      providedType: mimeType
    });
  }
};

/**
 * Generate optimized file path for storage
 */
const generateFilePath = (
  userId: string,
  category: MediaCategory,
  filename: string,
  mediaId?: string
): string => {
  const timestamp = Date.now();
  const hash = crypto.createHash('md5').update(`${userId}${filename}${timestamp}`).digest('hex').substring(0, 8);
  const fileExtension = filename.split('.').pop() || 'file';
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${userId}/${category}/${timestamp}-${hash}-${mediaId || sanitizedFilename}.${fileExtension}`;
};

/**
 * Upload single media file
 */
export const uploadMedia = async (
  userId: string,
  file: Buffer,
  filename: string,
  mimeType: string,
  category: MediaCategory,
  options: MediaUploadOptions = { generateThumbnail: false }
): Promise<MediaUploadResult> => {
  try {
    // Validate file
    validateFile(file, filename, mimeType, category);
    
    const mediaId = uuidv4();
    const bucketName = MEDIA_BUCKETS[category];
    const filePath = generateFilePath(userId, category, filename, mediaId);
    
    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: false,
        cacheControl: '3600'
      });

    if (uploadError) {
      throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: uploadError });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Save metadata to database
    const mediaMetadata = await prisma.media.create({
      data: {
        id: mediaId,
        filename: filename,
        originalName: filename,
        mimeType: mimeType,
        size: file.length,
        category: category as any,
        storageProvider: 'SUPABASE',
        storageKey: filePath,
        url: urlData.publicUrl,
        bucketName: bucketName,
        uploadedBy: userId,
        tags: options.tags || [],
        metadata: {
          folder: options.folder,
          quality: options.quality,
          generateThumbnail: options.generateThumbnail
        }
      }
    });

    // Cache metadata
    await redisClient.setex(
      CACHE_KEYS.mediaMetadata(mediaId),
      CACHE_TTL.metadata,
      JSON.stringify(mediaMetadata)
    );

    // Invalidate user media cache
    const cachePattern = CACHE_KEYS.mediaList(userId, '*');
    const keys = await redisClient.keys(cachePattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }

    // Send Kafka event
    await kafkaProducer.sendMessage('media-events', {
      type: 'MEDIA_UPLOAD_COMPLETED',
      mediaId,
      userId,
      category,
      filename,
      size: file.length,
      url: urlData.publicUrl,
      timestamp: new Date().toISOString()
    });

    const result: MediaUploadResult = {
      id: mediaId,
      url: urlData.publicUrl,
      publicId: filePath,
      format: filename.split('.').pop() || 'unknown',
      size: file.length,
      metadata: mediaMetadata as MediaMetadata
    };

    logger.info(`Media uploaded successfully: ${mediaId} for user: ${userId}`);
    return result;

  } catch (error) {
    logger.error('Media upload failed:', isError(error) ? error : new Error(String(error)));
    
    // Send failure event
    await kafkaProducer.sendMessage('media-events', {
      type: 'MEDIA_UPLOAD_FAILED',
      userId,
      category,
      filename,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    throw error;
  }
};

/**
 * Upload multiple media files
 */
export const uploadMultipleMedia = async (
  userId: string,
  files: Array<{ buffer: Buffer; filename: string; mimeType: string }>,
  category: MediaCategory,
  options: MediaUploadOptions = { generateThumbnail: false }
): Promise<{ media: MediaUploadResult[]; failed: Array<{ filename: string; error: string }> }> => {
  const results: MediaUploadResult[] = [];
  const failed: Array<{ filename: string; error: string }> = [];

  for (const file of files) {
    try {
      const result = await uploadMedia(
        userId,
        file.buffer,
        file.filename,
        file.mimeType,
        category,
        options
      );
      results.push(result);
    } catch (error) {
      failed.push({
        filename: file.filename,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { media: results, failed };
};

/**
 * Get media metadata by ID
 */
export const getMediaById = async (mediaId: string): Promise<MediaMetadata | null> => {
  try {
    // Try cache first
    const cached = await redisClient.get(CACHE_KEYS.mediaMetadata(mediaId));
    if (cached) {
      return JSON.parse(cached) as MediaMetadata;
    }

    // Get from database
    const media = await prisma.media.findUnique({
      where: { id: mediaId }
    });

    if (media) {
      // Cache result
      await redisClient.setex(
        CACHE_KEYS.mediaMetadata(mediaId),
        CACHE_TTL.metadata,
        JSON.stringify(media)
      );
    }

    return media as MediaMetadata | null;
  } catch (error) {
    logger.error(`Failed to get media ${mediaId}:`, isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Query media with filters and pagination
 */
export const queryMedia = async (query: MediaQuery): Promise<{
  media: MediaMetadata[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}> => {
  try {
    const {
      userId,
      category,
      type,
      tags,
      dateFrom,
      dateTo,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    // Build where clause
    const where: any = {};
    
    if (userId) where.uploadedBy = userId;
    if (category) where.category = category;
    if (type) where.mimeType = { startsWith: type };
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Get total count
    const total = await prisma.media.count({ where });

    // Get media
    const media = await prisma.media.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: offset,
      take: limit
    });

    return {
      media: media as MediaMetadata[],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  } catch (error) {
    logger.error('Failed to query media:', isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Delete media files
 */
export const deleteMedia = async (request: MediaDeletionRequest): Promise<{
  deleted: string[];
  failed: Array<{ id: string; error: string }>;
}> => {
  const { mediaIds, deleteFromStorage = true } = request;
  const deleted: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  for (const mediaId of mediaIds) {
    try {
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          width: true,
          height: true,
          duration: true,
          url: true,
          thumbnailUrl: true,
          cdnUrl: true,
          category: true,
          storageProvider: true,
          storageKey: true,
          bucketName: true,
          uploadedBy: true,
          tags: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true
        }
      });

      if (!media) {
        failed.push({ id: mediaId, error: 'Media not found' });
        continue;
      }

      // Delete from storage if requested  
      if (deleteFromStorage) {
        // Get bucket name from category
        const categoryKey = media.category.toLowerCase() as keyof typeof MEDIA_BUCKETS;
        const bucketName = MEDIA_BUCKETS[categoryKey];
        
        const { error: deleteError } = await supabaseAdmin.storage
          .from(bucketName)
          .remove([media.storageKey]);

        if (deleteError) {
          logger.error(`Failed to delete from storage: ${mediaId}`, deleteError);
        }
      }

      // Delete from database
      await prisma.media.delete({
        where: { id: mediaId }
      });

      // Remove from cache
      await redisClient.del(CACHE_KEYS.mediaMetadata(mediaId));

      // Send Kafka event
      await kafkaProducer.sendMessage('media-events', {
        type: 'MEDIA_DELETED',
        mediaId,
        userId: media.uploadedBy,
        category: media.category,
        filename: media.filename,
        timestamp: new Date().toISOString()
      });

      deleted.push(mediaId);

    } catch (error) {
      failed.push({
        id: mediaId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { deleted, failed };
};

/**
 * Get media statistics for user
 */
export const getMediaStats = async (userId: string): Promise<MediaStats> => {
  try {
    // Try cache first
    const cached = await redisClient.get(CACHE_KEYS.mediaStats(userId));
    if (cached) {
      return JSON.parse(cached) as MediaStats;
    }

    // Get stats from database
    const totalFiles = await prisma.media.count({
      where: { uploadedBy: userId }
    });

    const totalSizeResult = await prisma.media.aggregate({
      where: { uploadedBy: userId },
      _sum: { size: true }
    });

    const totalSize = totalSizeResult._sum.size || 0;

    // Get stats by category
    const categoryStats = await prisma.media.groupBy({
      by: ['category'],
      where: { uploadedBy: userId },
      _count: { id: true }
    });

    const byCategory = categoryStats.reduce((acc, stat) => {
      acc[stat.category] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Get stats by type (simplified)
    const byType = {
      image: await prisma.media.count({
        where: { uploadedBy: userId, mimeType: { startsWith: 'image/' } }
      }),
      video: await prisma.media.count({
        where: { uploadedBy: userId, mimeType: { startsWith: 'video/' } }
      }),
      audio: await prisma.media.count({
        where: { uploadedBy: userId, mimeType: { startsWith: 'audio/' } }
      }),
      document: await prisma.media.count({
        where: { uploadedBy: userId, mimeType: { startsWith: 'application/' } }
      }),
      other: totalFiles - (await prisma.media.count({
        where: {
          uploadedBy: userId,
          OR: [
            { mimeType: { startsWith: 'image/' } },
            { mimeType: { startsWith: 'video/' } },
            { mimeType: { startsWith: 'audio/' } },
            { mimeType: { startsWith: 'application/' } }
          ]
        }
      }))
    };

    const stats: MediaStats = {
      totalFiles,
      totalSize,
      byCategory,
      byType,
      storageUsage: {
        used: totalSize,
        limit: 1073741824, // 1GB default limit
        percentage: Math.min((totalSize / 1073741824) * 100, 100)
      }
    };

    // Cache stats
    await redisClient.setex(
      CACHE_KEYS.mediaStats(userId),
      CACHE_TTL.stats,
      JSON.stringify(stats)
    );

    return stats;
  } catch (error) {
    logger.error(`Failed to get media stats for user ${userId}:`, isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Clean up orphaned files (files in storage but not in database)
 */
export const cleanupOrphanedFiles = async (): Promise<{
  cleaned: number;
  errors: string[];
}> => {
  let cleaned = 0;
  const errors: string[] = [];

  try {
    for (const [category, bucketName] of Object.entries(MEDIA_BUCKETS)) {
      try {
        // List all files in bucket
        const { data: files, error: listError } = await supabaseAdmin.storage
          .from(bucketName)
          .list('', { limit: 1000 });

        if (listError) {
          errors.push(`Failed to list files in ${bucketName}: ${listError.message}`);
          continue;
        }

        if (!files || files.length === 0) continue;

        // Check which files exist in database
        const dbFiles = await prisma.media.findMany({
          where: { bucketName },
          select: { storageKey: true }
        });

        const dbFileKeys = new Set(dbFiles.map(f => f.storageKey));

        // Find orphaned files
        const orphanedFiles = files.filter(file => {
          const fullPath = file.name;
          return !dbFileKeys.has(fullPath);
        });

        // Delete orphaned files
        if (orphanedFiles.length > 0) {
          const filePaths = orphanedFiles.map(f => f.name);
          const { error: deleteError } = await supabaseAdmin.storage
            .from(bucketName)
            .remove(filePaths);

          if (deleteError) {
            errors.push(`Failed to delete orphaned files from ${bucketName}: ${deleteError.message}`);
          } else {
            cleaned += orphanedFiles.length;
          }
        }

      } catch (error) {
        errors.push(`Error processing bucket ${bucketName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    logger.info(`Cleanup completed: ${cleaned} files cleaned, ${errors.length} errors`);
    return { cleaned, errors };

  } catch (error) {
    logger.error('Cleanup failed:', isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Generate signed URL for temporary access
 */
export const generateSignedUrl = async (
  mediaId: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    // Get media directly from database with all fields including category
    const media = await prisma.media.findUnique({
      where: { id: mediaId }
    });
    
    if (!media) {
      throw createError(VALIDATION_ERRORS.INVALID_INPUT, { id: mediaId });
    }

    // Get bucket name from category 
    const categoryKey = media.category.toLowerCase() as keyof typeof MEDIA_BUCKETS;
    const bucketName = MEDIA_BUCKETS[categoryKey];
    
    if (!bucketName) {
      throw createError(VALIDATION_ERRORS.INVALID_INPUT, { category: media.category });
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(media.storageKey, expiresIn);

    if (error) {
      throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
    }

    return data.signedUrl;
  } catch (error) {
    logger.error(`Failed to generate signed URL for media ${mediaId}:`, isError(error) ? error : new Error(String(error)));
    throw error;
  }
};