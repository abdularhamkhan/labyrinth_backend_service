import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/jwt.middleware";
import {
  createProject,
  getProjectDetails,
  updateProject,
  addCollaborator,
  removeCollaborator,
  createTask,
  updateTask,
  getUserProjects,
  getProjectTasks,
} from "../services/project.service";
import { ValidationError } from "../constants/error";

interface Task {
  status: string;
}

// =============================================================================
// PROJECT MANAGEMENT CONTROLLERS - LABYRINTH PLATFORM
// =============================================================================

/**
 * CREATE PROJECT
 * Route: POST /api/projects
 * Auth: Required
 * Body: { title, description, workspaceName, workspaceDescription?, techStackIds? }
 */
export const createProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { title, description, workspaceName, workspaceDescription, techStackIds } = req.body;

  if (!title || !description || !workspaceName) {
    throw new ValidationError("Title, description, and workspace name are required");
  }

  const project = await createProject(userId, {
    title,
    description,
    workspaceName,
    workspaceDescription,
    techStackIds,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: { project },
  });
};

/**
 * GET PROJECT DETAILS
 * Route: GET /api/projects/:projectId
 * Auth: Required
 */
export const getProjectDetailsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;

  const project = await getProjectDetails(projectId, userId);

  res.status(200).json({
    success: true,
    message: "Project details retrieved successfully",
    data: { project },
  });
};

/**
 * UPDATE PROJECT
 * Route: PUT /api/projects/:projectId
 * Auth: Required
 * Body: { title?, description?, techStackIds? }
 */
export const updateProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("At least one field must be provided for update");
  }

  const project = await updateProject(projectId, userId, updateData);

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: { project },
  });
};

/**
 * GET USER PROJECTS
 * Route: GET /api/projects
 * Auth: Required
 */
export const getUserProjectsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const projects = await getUserProjects(userId);

  res.status(200).json({
    success: true,
    message: "User projects retrieved successfully",
    data: {
      projects,
      totalCount: projects.length,
    },
  });
};

/**
 * ADD COLLABORATOR
 * Route: POST /api/projects/:projectId/collaborators
 * Auth: Required
 * Body: { collaboratorId, permissions? }
 */
export const addCollaboratorController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;
  const { collaboratorId, permissions = ['READ', 'WRITE'] } = req.body;

  if (!collaboratorId) {
    throw new ValidationError("Collaborator ID is required");
  }

  const result = await addCollaborator(projectId, userId, collaboratorId, permissions);

  res.status(200).json({
    success: true,
    message: "Collaborator added successfully",
    data: result,
  });
};

/**
 * REMOVE COLLABORATOR
 * Route: DELETE /api/projects/:projectId/collaborators/:collaboratorId
 * Auth: Required
 */
export const removeCollaboratorController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId, collaboratorId } = req.params;

  await removeCollaborator(projectId, userId, collaboratorId);

  res.status(200).json({
    success: true,
    message: "Collaborator removed successfully",
    data: { projectId, collaboratorId },
  });
};

/**
 * CREATE TASK
 * Route: POST /api/projects/:projectId/tasks
 * Auth: Required
 * Body: { title, description?, assignedToId?, dueDate?, status? }
 */
export const createTaskController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;
  const { title, description, assignedToId, dueDate, status } = req.body;

  if (!title) {
    throw new ValidationError("Task title is required");
  }

  const taskData = {
    title,
    description,
    assignedToId,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    status,
    projectId,
  };

  const task = await createTask(projectId, userId, taskData);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: { task },
  });
};

/**
 * UPDATE TASK
 * Route: PUT /api/projects/tasks/:taskId
 * Auth: Required
 * Body: { title?, description?, status?, assignedToId?, dueDate? }
 */
export const updateTaskController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { taskId } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("At least one field must be provided for update");
  }

  // Convert dueDate string to Date if provided
  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }

  const task = await updateTask(taskId, userId, updateData);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: { task },
  });
};

/**
 * GET PROJECT TASKS
 * Route: GET /api/projects/:projectId/tasks
 * Auth: Required
 * Query: ?status=PENDING&assignedToId=uuid&page=1&limit=20
 */
export const getProjectTasksController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;
  const { status, assignedToId, page = 1, limit = 20 } = req.query;

  const filters = {
    status: status as any,
    assignedToId: assignedToId as string,
    page: parseInt(page as string) || 1,
    limit: Math.min(parseInt(limit as string) || 20, 100),
  };

  const result = await getProjectTasks(projectId, userId, filters);

  res.status(200).json({
    success: true,
    message: "Project tasks retrieved successfully",
    data: {
      tasks: result.tasks,
      pagination: {
        currentPage: filters.page,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        pageSize: filters.limit,
      },
    },
  });
};

/**
 * GET PROJECT DASHBOARD
 * Route: GET /api/projects/:projectId/dashboard
 * Auth: Required
 */
export const getProjectDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.params;

  // Get project details and tasks in parallel
  const [project, tasksResult] = await Promise.all([
    getProjectDetails(projectId, userId),
    getProjectTasks(projectId, userId, { limit: 10 }),
  ]);

  // Calculate task statistics
  const taskStats = {
    total: project._count.tasks,
    pending: project.tasks.filter((task: Task) => task.status === 'PENDING').length,
    inProgress: project.tasks.filter((task: Task) => task.status === 'IN_PROGRESS').length,
    completed: project.tasks.filter((task: Task) => task.status === 'COMPLETED').length,
    blocked: project.tasks.filter((task: Task) => task.status === 'BLOCKED').length,
  };

  res.status(200).json({
    success: true,
    message: "Project dashboard data retrieved successfully",
    data: {
      project,
      taskStats,
      recentTasks: tasksResult.tasks,
      collaboratorCount: project._count.collaborators,
    },
  });
};