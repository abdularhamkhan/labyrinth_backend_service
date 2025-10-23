import z from "zod";

// =============================================================================
// MEDIA MANAGEMENT SCHEMAS - LABYRINTH PLATFORM
// =============================================================================

/**
 * MEDIA CATEGORY ENUM SCHEMA
 */
export const mediaCategorySchema = z.enum([
  'user_avatar',
  'project_image',
  'chat_media',
  'project_file',
  'workspace_banner',
  'system_asset'
]);

export type MediaCategory = z.infer<typeof mediaCategorySchema>;

/**
 * MEDIA TYPE ENUM SCHEMA
 */
export const mediaTypeSchema = z.enum([
  'image',
  'video',
  'audio',
  'document',
  'archive',
  'other'
]);

export type MediaType = z.infer<typeof mediaTypeSchema>;

/**
 * MEDIA TRANSFORMATION SCHEMA
 */
export const mediaTransformationSchema = z.object({
  type: z.enum(['resize', 'crop', 'rotate', 'filter', 'format', 'quality']),
  params: z.record(z.string(), z.any()),
});

export type MediaTransformation = z.infer<typeof mediaTransformationSchema>;

/**
 * MEDIA UPLOAD OPTIONS SCHEMA
 */
export const mediaUploadOptionsSchema = z.object({
  folder: z.string().optional(),
  quality: z.number().min(1).max(100).optional(),
  format: z.string().optional(),
  transformation: z.array(mediaTransformationSchema).optional(),
  generateThumbnail: z.boolean().default(false),
  allowedTypes: z.array(z.string()).optional(),
  maxSize: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
});

export type MediaUploadOptions = z.infer<typeof mediaUploadOptionsSchema>;

/**
 * MEDIA METADATA SCHEMA
 */
export const mediaMetadataSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().positive(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  cdnUrl: z.string().url().optional(),
  storageProvider: z.enum(['CLOUDINARY', 'AWS_S3', 'LOCAL']),
  storageKey: z.string().min(1),
  uploadedBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>;

/**
 * MEDIA UPLOAD RESULT SCHEMA
 */
export const mediaUploadResultSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  cdnUrl: z.string().url().optional(),
  publicId: z.string(),
  format: z.string(),
  size: z.number().positive(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  metadata: mediaMetadataSchema,
});

export type MediaUploadResult = z.infer<typeof mediaUploadResultSchema>;

/**
 * FILE UPLOAD REQUEST SCHEMA
 */
export const fileUploadRequestSchema = z.object({
  category: mediaCategorySchema,
  folder: z.string().optional(),
  generateThumbnail: z.boolean().default(false),
  quality: z.number().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export type FileUploadRequest = z.infer<typeof fileUploadRequestSchema>;

/**
 * MULTIPLE FILE UPLOAD SCHEMA
 */
export const multipleFileUploadSchema = z.object({
  category: mediaCategorySchema,
  options: mediaUploadOptionsSchema.optional(),
});

export type MultipleFileUploadRequest = z.infer<typeof multipleFileUploadSchema>;

/**
 * MEDIA QUERY SCHEMA
 */
export const mediaQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  category: mediaCategorySchema.optional(),
  type: mediaTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'size', 'filename']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type MediaQuery = z.infer<typeof mediaQuerySchema>;

/**
 * MEDIA DELETION REQUEST SCHEMA
 */
export const mediaDeletionRequestSchema = z.object({
  mediaIds: z.array(z.string().uuid()).min(1),
  deleteFromStorage: z.boolean().default(true),
});

export type MediaDeletionRequest = z.infer<typeof mediaDeletionRequestSchema>;

/**
 * MEDIA STATS SCHEMA
 */
export const mediaStatsSchema = z.object({
  totalFiles: z.number().int().nonnegative(),
  totalSize: z.number().nonnegative(),
  byCategory: z.record(z.string(), z.number().int().nonnegative()),
  byType: z.record(z.string(), z.number().int().nonnegative()),
  storageUsage: z.object({
    used: z.number().nonnegative(),
    limit: z.number().positive(),
    percentage: z.number().min(0).max(100),
  }),
});

export type MediaStats = z.infer<typeof mediaStatsSchema>;

/**
 * MEDIA PROCESSING JOB SCHEMA
 */
export const processingJobSchema = z.object({
  id: z.string().uuid(),
  mediaId: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  transformations: z.array(mediaTransformationSchema),
  progress: z.number().min(0).max(100),
  error: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

export type ProcessingJob = z.infer<typeof processingJobSchema>;

/**
 * CLOUDINARY CONFIGURATION SCHEMA
 */
export const cloudinaryConfigSchema = z.object({
  cloudName: z.string().min(1),
  apiKey: z.string().min(1),
  apiSecret: z.string().min(1),
  secure: z.boolean().default(true),
  folder: z.string().default('labyrinth'),
});

export type CloudinaryConfig = z.infer<typeof cloudinaryConfigSchema>;

/**
 * AWS S3 CONFIGURATION SCHEMA
 */
export const awsS3ConfigSchema = z.object({
  region: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  bucket: z.string().min(1),
  cdnUrl: z.string().url().optional(),
});

export type AWSS3Config = z.infer<typeof awsS3ConfigSchema>;

/**
 * MEDIA VALIDATION RULES SCHEMA
 */
export const mediaValidationRuleSchema = z.object({
  maxSize: z.number().positive(),
  allowedTypes: z.array(z.string()),
  maxWidth: z.number().positive().optional(),
  maxHeight: z.number().positive().optional(),
  minWidth: z.number().positive().optional(),
  minHeight: z.number().positive().optional(),
  aspectRatio: z.number().positive().optional(),
});

export type MediaValidationRule = z.infer<typeof mediaValidationRuleSchema>;

/**
 * MEDIA UPLOAD RESPONSE SCHEMAS
 */
export const mediaUploadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    media: mediaUploadResultSchema,
    processingJobId: z.string().optional(),
  }),
});

export const multipleMediaUploadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    media: z.array(mediaUploadResultSchema),
    failed: z.array(z.object({
      filename: z.string(),
      error: z.string(),
    })).optional(),
    processingJobs: z.array(z.string()).optional(),
  }),
});

/**
 * MEDIA LIST RESPONSE SCHEMA
 */
export const mediaListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    media: z.array(mediaMetadataSchema),
    pagination: z.object({
      total: z.number().int().nonnegative(),
      limit: z.number().int().positive(),
      offset: z.number().int().nonnegative(),
      hasMore: z.boolean(),
    }),
  }),
});

/**
 * MEDIA DELETION RESPONSE SCHEMA
 */
export const mediaDeletionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    deleted: z.array(z.string()),
    failed: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }),
});

/**
 * MEDIA STATS RESPONSE SCHEMA
 */
export const mediaStatsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    stats: mediaStatsSchema,
  }),
});

/**
 * AVATAR UPLOAD SCHEMA (specific for user avatars)
 */
export const avatarUploadSchema = z.object({
  generateThumbnail: z.boolean().default(true),
  quality: z.number().min(60).max(100).default(85),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
});

export type AvatarUploadRequest = z.infer<typeof avatarUploadSchema>;

/**
 * PROJECT IMAGE UPLOAD SCHEMA
 */
export const projectImageUploadSchema = z.object({
  projectId: z.string().uuid(),
  generateThumbnail: z.boolean().default(true),
  quality: z.number().min(70).max(100).default(90),
  tags: z.array(z.string()).optional(),
});

export type ProjectImageUploadRequest = z.infer<typeof projectImageUploadSchema>;

/**
 * CHAT MEDIA UPLOAD SCHEMA
 */
export const chatMediaUploadSchema = z.object({
  chatId: z.string().uuid(),
  messageType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'FILE']).default('IMAGE'),
  generateThumbnail: z.boolean().default(true),
  quality: z.number().min(60).max(95).default(80),
});

export type ChatMediaUploadRequest = z.infer<typeof chatMediaUploadSchema>;

