/**
 * =============================================================================
 * MEDIA MANAGEMENT TYPES - LABYRINTH PLATFORM
 * =============================================================================
 *
 * Type definitions for media management including file uploads, image processing,
 * cloud storage integration (Cloudinary/AWS S3), and media metadata handling.
 *
 * =============================================================================
 */

// =============================================================================
// CORE MEDIA TYPES
// =============================================================================

export interface MediaMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For videos/audio
  url: string;
  thumbnailUrl?: string;
  cdnUrl?: string;
  storageProvider: "CLOUDINARY" | "AWS_S3" | "LOCAL";
  storageKey: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaUploadOptions {
  folder?: string;
  quality?: number;
  format?: string;
  transformation?: MediaTransformation[];
  generateThumbnail?: boolean;
  allowedTypes?: string[];
  maxSize?: number;
  tags?: string[];
}

export interface MediaTransformation {
  type: "resize" | "crop" | "rotate" | "filter" | "format" | "quality";
  params: Record<string, any>;
}

export interface MediaUploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  cdnUrl?: string;
  publicId: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  metadata: MediaMetadata;
}

// =============================================================================
// MEDIA CATEGORIES
// =============================================================================

export enum MediaCategory {
  USER_AVATAR = "user_avatar",
  PROJECT_IMAGE = "project_image",
  CHAT_MEDIA = "chat_media",
  PROJECT_FILE = "project_file",
  WORKSPACE_BANNER = "workspace_banner",
  SYSTEM_ASSET = "system_asset",
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  ARCHIVE = "archive",
  OTHER = "other",
}

export enum ImageFormat {
  JPEG = "jpg",
  PNG = "png",
  WEBP = "webp",
  GIF = "gif",
  SVG = "svg",
}

// =============================================================================
// UPLOAD PROCESSING
// =============================================================================

export interface FileUploadData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface MultipleFileUpload {
  files: FileUploadData[];
  category: MediaCategory;
  options?: MediaUploadOptions;
}

export interface ProcessingJob {
  id: string;
  mediaId: string;
  status: "pending" | "processing" | "completed" | "failed";
  transformations: MediaTransformation[];
  progress: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// =============================================================================
// MEDIA VALIDATION
// =============================================================================

export interface MediaValidationRule {
  maxSize: number;
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
}

export const MEDIA_VALIDATION_RULES: Record<MediaCategory, MediaValidationRule> = {
  [MediaCategory.USER_AVATAR]: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxWidth: 2048,
    maxHeight: 2048,
    minWidth: 100,
    minHeight: 100,
    aspectRatio: 1, // Square images only
  },
  [MediaCategory.PROJECT_IMAGE]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxWidth: 4096,
    maxHeight: 4096,
    minWidth: 200,
    minHeight: 200,
  },
  [MediaCategory.CHAT_MEDIA]: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
    ],
    maxWidth: 2048,
    maxHeight: 2048,
  },
  [MediaCategory.PROJECT_FILE]: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      "image/*",
      "video/*",
      "audio/*",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "text/plain",
      "application/json",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  },
  [MediaCategory.WORKSPACE_BANNER]: {
    maxSize: 8 * 1024 * 1024, // 8MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxWidth: 3840,
    maxHeight: 2160,
    minWidth: 800,
    minHeight: 300,
  },
  [MediaCategory.SYSTEM_ASSET]: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
    maxWidth: 2048,
    maxHeight: 2048,
  },
};

// =============================================================================
// CLOUD STORAGE CONFIGURATION
// =============================================================================

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  secure: boolean;
  folder: string;
}

export interface AWSS3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  cdnUrl?: string;
}

export interface StorageProvider {
  type: "CLOUDINARY" | "AWS_S3";
  config: CloudinaryConfig | AWSS3Config;
}

// =============================================================================
// MEDIA OPERATIONS
// =============================================================================

export interface MediaQuery {
  userId?: string;
  category?: MediaCategory;
  type?: MediaType;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "size" | "filename";
  sortOrder?: "asc" | "desc";
}

export interface MediaDeletionResult {
  id: string;
  deleted: boolean;
  storageDeleted: boolean;
  error?: string;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  byCategory: Record<MediaCategory, number>;
  byType: Record<MediaType, number>;
  storageUsage: {
    used: number;
    limit: number;
    percentage: number;
  };
}

// =============================================================================
// MEDIA PROCESSING EVENTS
// =============================================================================

export interface MediaUploadEvent {
  type: "MEDIA_UPLOAD_STARTED" | "MEDIA_UPLOAD_COMPLETED" | "MEDIA_UPLOAD_FAILED";
  mediaId: string;
  userId: string;
  category: MediaCategory;
  filename: string;
  size: number;
  url?: string;
  error?: string;
  timestamp: string;
}

export interface MediaProcessingEvent {
  type: "MEDIA_PROCESSING_STARTED" | "MEDIA_PROCESSING_COMPLETED" | "MEDIA_PROCESSING_FAILED";
  jobId: string;
  mediaId: string;
  transformations: MediaTransformation[];
  progress: number;
  error?: string;
  timestamp: string;
}

export interface MediaDeletionEvent {
  type: "MEDIA_DELETED";
  mediaId: string;
  userId: string;
  category: MediaCategory;
  filename: string;
  timestamp: string;
}

// =============================================================================
// MEDIA CACHE TYPES
// =============================================================================

export interface MediaCacheData {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata: Partial<MediaMetadata>;
  cachedAt: number;
  expiresAt: number;
}

export interface MediaCacheOptions {
  ttl?: number; // Time to live in seconds
  includeMetadata?: boolean;
  generateThumbnail?: boolean;
}
