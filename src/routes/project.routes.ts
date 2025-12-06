import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/error.middleware";
import {
  createProjectController,
  getProjectDetailsController,
  updateProjectController,
  getUserProjectsController,
  addCollaboratorController,
  removeCollaboratorController,
  createTaskController,
  updateTaskController,
  getProjectTasksController,
  getProjectDashboard,
  searchProjectsController,
  getProjectActivityController,
  getProjectAnalyticsController,
} from "../controllers/project.controller";

// =============================================================================
// PROJECT ROUTES - LABYRINTH COLLABORATION PLATFORM
// =============================================================================

const router = Router();

// All project routes require authentication
router.use(authenticateUser);

// =============================================================================
// PROJECT MANAGEMENT
// =============================================================================

// Get user's projects
// Usage: GET /api/projects
// Headers: Authorization: Bearer <jwt_token>
router.get("/", asyncHandler(getUserProjectsController));

// Search projects by keyword and tech stack
// Usage: GET /api/projects/search?q=keyword&techStacks=JavaScript,React&limit=20
// Headers: Authorization: Bearer <jwt_token>
router.get("/search", asyncHandler(searchProjectsController));

// Create new project
// Usage: POST /api/projects
// Headers: Authorization: Bearer <jwt_token>
// Body: { title: string, description: string, workspaceName: string, workspaceDescription?: string, techStackIds?: string[] }
router.post("/", asyncHandler(createProjectController));

// Get project details
// Usage: GET /api/projects/:projectId
// Headers: Authorization: Bearer <jwt_token>
router.get("/:projectId", asyncHandler(getProjectDetailsController));

// Update project
// Usage: PUT /api/projects/:projectId
// Headers: Authorization: Bearer <jwt_token>
// Body: { title?: string, description?: string, techStackIds?: string[] }
router.put("/:projectId", asyncHandler(updateProjectController));

// Get project dashboard (overview with stats)
// Usage: GET /api/projects/:projectId/dashboard
// Headers: Authorization: Bearer <jwt_token>
router.get("/:projectId/dashboard", asyncHandler(getProjectDashboard));

// Get project activity feed
// Usage: GET /api/projects/:projectId/activity?limit=20
// Headers: Authorization: Bearer <jwt_token>
router.get("/:projectId/activity", asyncHandler(getProjectActivityController));

// Get project analytics
// Usage: GET /api/projects/:projectId/analytics
// Headers: Authorization: Bearer <jwt_token>
router.get("/:projectId/analytics", asyncHandler(getProjectAnalyticsController));

// =============================================================================
// COLLABORATOR MANAGEMENT
// =============================================================================

// Add collaborator to project
// Usage: POST /api/projects/:projectId/collaborators
// Headers: Authorization: Bearer <jwt_token>
// Body: { collaboratorId: string, permissions?: string[] }
router.post("/:projectId/collaborators", asyncHandler(addCollaboratorController));

// Remove collaborator from project
// Usage: DELETE /api/projects/:projectId/collaborators/:collaboratorId
// Headers: Authorization: Bearer <jwt_token>
router.delete(
  "/:projectId/collaborators/:collaboratorId",
  asyncHandler(removeCollaboratorController)
);

// =============================================================================
// TASK MANAGEMENT
// =============================================================================

// Get project tasks
// Usage: GET /api/projects/:projectId/tasks?status=PENDING&assignedToId=uuid&page=1&limit=20
// Headers: Authorization: Bearer <jwt_token>
router.get("/:projectId/tasks", asyncHandler(getProjectTasksController));

// Create task in project
// Usage: POST /api/projects/:projectId/tasks
// Headers: Authorization: Bearer <jwt_token>
// Body: { title: string, description?: string, assignedToId?: string, dueDate?: string, status?: TaskStatus }
router.post("/:projectId/tasks", asyncHandler(createTaskController));

// Update task
// Usage: PUT /api/projects/tasks/:taskId
// Headers: Authorization: Bearer <jwt_token>
// Body: { title?: string, description?: string, status?: TaskStatus, assignedToId?: string, dueDate?: string }
router.put("/tasks/:taskId", asyncHandler(updateTaskController));

export default router;
