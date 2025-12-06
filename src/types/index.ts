/**
 * =============================================================================
 * TYPES INDEX - CENTRALIZED TYPE EXPORTS FOR LABYRINTH PLATFORM
 * =============================================================================
 *
 * This file provides centralized access to all type definitions used
 * throughout the Labyrinth collaboration platform. Import types from here
 * rather than individual files for better maintainability.
 *
 * =============================================================================
 */

// =============================================================================
// CORE LABYRINTH PLATFORM TYPES
// =============================================================================

// Common application types
export * from "./common.types";

// Media management types
export * from "./media.types";

// Redis service types
export * from "./redis.types";

// Legacy types (to be phased out)
export * from "./friends.types";

// =============================================================================
// LABYRINTH PLATFORM SCHEMA TYPES
// =============================================================================

// User Profile and Authentication Types
export type {
  UserProfile,
  UpdateProfileInput,
  GetProfileResponse,
  UpdateProfileResponse,
  DeleteUserResponse,
  LabyrinthUserProfile,
  CreateTechStackInput,
  CreateDemographicInput,
  UpdatePreferencesInput,
  UserProfileWithRelations,
  UpdateLabyrinthProfileInput,
  CollaborationStats,
} from "../schemas/user.schema";

export type {
  signupInputTypes,
  loginInputTypes,
  verifyOtpInputTypes,
} from "../schemas/auth.schema";

// Matchmaking and Recommendation Types
export type {
  UserRecommendation,
  ProjectRecommendation,
  SwipeAction,
  Match,
  SwipeStatus,
  MatchmakingDashboard,
  CompatibilityFactors,
} from "../schemas/matchmaking.schema";

// Chat and Messaging Types
export type {
  Message,
  ChatParticipant,
  Chat,
  CreateDirectChatInput,
  CreateProjectChatInput,
  SendMessageInput,
  TypingIndicatorInput,
  AddUserToProjectChatInput,
  ChatMessagesResponse,
  UserChatsResponse,
  WebSocketMessage,
  WebSocketTyping,
  WebSocketPresence,
  WebSocketMatch,
  WebSocketJoinChat,
  WebSocketMessageRead,
} from "../schemas/chat.schema";

// Media Management Types
export type {
  MediaCategory,
  MediaType,
  MediaTransformation,
  MediaUploadOptions,
  MediaMetadata,
  MediaUploadResult,
  FileUploadRequest,
  MultipleFileUploadRequest,
  MediaQuery,
  MediaDeletionRequest,
  MediaStats,
  ProcessingJob,
  CloudinaryConfig,
  AWSS3Config,
  MediaValidationRule,
  AvatarUploadRequest,
  ProjectImageUploadRequest,
  ChatMediaUploadRequest,
} from "../schemas/media.schema";

// Project Management Types
export type {
  TaskStatus,
  RolePermissions,
  CreateProjectInput,
  UpdateProjectInput,
  AddCollaboratorInput,
  RemoveCollaboratorInput,
  CreateTaskInput,
  UpdateTaskInput,
  ProjectTasksQuery,
  Collaborator,
  Task,
  ProjectRole,
  Workspace,
  ProjectDetails,
  UserProject,
} from "../schemas/project.schema";

// =============================================================================
// LEGACY TYPES (TO BE PHASED OUT)
// =============================================================================
