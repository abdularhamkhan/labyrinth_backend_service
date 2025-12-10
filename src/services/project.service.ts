import { prisma } from "../config/prisma";
import {
  DATABASE_ERRORS,
  USER_ERRORS,
  VALIDATION_ERRORS,
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from "../constants/error";
// Kafka disabled - import commented out
// import { kafkaProducer } from "./kafka-producer.service";
import { getOrSetCache, CacheKeys, CACHE_TTL, deleteCache } from "../utils/cache.util";

// =============================================================================
// PROJECT MANAGEMENT SERVICE - LABYRINTH PLATFORM
// =============================================================================

/**
 * Create new project with workspace
 */
export const createProject = async (
  creatorId: string,
  projectData: {
    title: string;
    description: string;
    workspaceName: string;
    workspaceDescription?: string;
    techStackIds?: string[];
  }
): Promise<any> => {
  try {
    // Create workspace first
    const workspace = await prisma.workspace.create({
      data: {
        name: projectData.workspaceName,
        description: projectData.workspaceDescription || "",
        user: {
          connect: { id: creatorId },
        },
      },
    });

    // Create project
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        workspaceId: workspace.id,
        collaborators: {
          connect: { id: creatorId },
        },
      },
    });

    // Link tech stacks if provided
    if (projectData.techStackIds && projectData.techStackIds.length > 0) {
      await prisma.projectTechStack.createMany({
        data: projectData.techStackIds.map((techStackId) => ({
          projectId: project.id,
          techStackId,
        })),
      });
    }

    // Create project role for creator
    await prisma.role.create({
      data: {
        name: "Project Owner",
        roleName: "Owner",
        permissions: ["READ", "WRITE", "DELETE", "MANAGE_USERS"],
        projectId: project.id,
        userRoles: {
          create: {
            userId: creatorId,
          },
        },
      },
    });

    // Publish project created event
    // await kafkaProducer.publishEvent({
    //   type: "PROJECT_CREATED",
    //   data: {
    //     projectId: project.id,
    //     workspaceId: workspace.id,
    //     creatorId,
    //     title: project.title,
    //     description: project.description,
    //     techStackIds: projectData.techStackIds || [],
    //     createdAt: new Date().toISOString(),
    //   },
    // });

    return await getProjectDetails(project.id, creatorId);
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get project details with collaborators and tasks
 */
export const getProjectDetails = async (projectId: string, userId: string): Promise<any> => {
  try {
    // Try to get from cache first
    return await getOrSetCache(
      CacheKeys.projectDetails(projectId),
      async () => {
        const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            lastActive: true,
            techStack: {
              select: {
                frameworks: true,
                languages: true,
                tools: true,
              },
            },
          },
        },
        techLinks: {
          include: {
            techStack: {
              select: {
                id: true,
                frameworks: true,
                languages: true,
                tools: true,
              },
            },
          },
        },
        roles: {
          include: {
            userRoles: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            dueDate: true,
            assignedTo: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10, // Latest 10 tasks
        },
        _count: {
          select: {
            collaborators: true,
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

        return {
          ...project,
          techStacks: project.techLinks.map((link) => link.techStack),
        };
      },
      CACHE_TTL.PROJECT_DETAILS
    );
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Update project information
 */
export const updateProject = async (
  projectId: string,
  userId: string,
  updateData: {
    title?: string;
    description?: string;
    techStackIds?: string[];
  }
): Promise<any> => {
  try {
    // Verify user has permission to update project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
      include: {
        roles: {
          include: {
            userRoles: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    // Check if user has write permissions
    const hasWritePermission = project.roles.some(
      (role) =>
        role.userRoles.length > 0 &&
        (role.permissions.includes("WRITE") || role.permissions.includes("MANAGE_USERS"))
    );

    if (!hasWritePermission) {
      throw new ValidationError("Insufficient permissions to update project");
    }

    // Invalidate project cache
    await deleteCache(CacheKeys.projectDetails(projectId));

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: updateData.title,
        description: updateData.description,
      },
    });

    // Update tech stacks if provided
    if (updateData.techStackIds !== undefined) {
      // Remove existing tech stack links
      await prisma.projectTechStack.deleteMany({
        where: { projectId },
      });

      // Add new tech stack links
      if (updateData.techStackIds.length > 0) {
        await prisma.projectTechStack.createMany({
          data: updateData.techStackIds.map((techStackId) => ({
            projectId,
            techStackId,
          })),
        });
      }
    }

    // Publish project updated event
    // await kafkaProducer.publishEvent({
    //   type: "PROJECT_UPDATED",
    //   data: {
    //     projectId,
    //     updatedBy: userId,
    //     changes: Object.keys(updateData),
    //     updatedAt: new Date().toISOString(),
    //   },
    // });

    return await getProjectDetails(projectId, userId);
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Add collaborator to project
 */
export const addCollaborator = async (
  projectId: string,
  userId: string,
  collaboratorId: string,
  rolePermissions: string[] = ["READ", "WRITE"]
): Promise<any> => {
  try {
    // Verify user has permission to add collaborators
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        roles: {
          some: {
            userRoles: {
              some: { userId },
            },
            permissions: {
              has: "MANAGE_USERS",
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or insufficient permissions", "PROJECT_NOT_FOUND");
    }

    // Check if user is already a collaborator
    const existingCollaborator = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: collaboratorId },
        },
      },
    });

    if (existingCollaborator) {
      throw new ConflictError("User is already a collaborator", "ALREADY_COLLABORATOR");
    }

    // Add user to project collaborators
    await prisma.project.update({
      where: { id: projectId },
      data: {
        collaborators: {
          connect: { id: collaboratorId },
        },
      },
    });

    // Create role for the new collaborator
    const collaboratorRole = await prisma.role.create({
      data: {
        name: "Collaborator",
        roleName: "Collaborator",
        permissions: rolePermissions,
        projectId,
        userRoles: {
          create: {
            userId: collaboratorId,
          },
        },
      },
    });

    // Publish collaborator added event
    // await kafkaProducer.publishEvent({
    //   type: "COLLABORATOR_ADDED",
    //   data: {
    //     projectId,
    //     collaboratorId,
    //     addedBy: userId,
    //     roleId: collaboratorRole.id,
    //     permissions: rolePermissions,
    //     addedAt: new Date().toISOString(),
    //   },
    // });

    return {
      projectId,
      collaboratorId,
      roleId: collaboratorRole.id,
      permissions: rolePermissions,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Remove collaborator from project
 */
export const removeCollaborator = async (
  projectId: string,
  userId: string,
  collaboratorId: string
): Promise<void> => {
  try {
    // Verify user has permission to remove collaborators
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        roles: {
          some: {
            userRoles: {
              some: { userId },
            },
            permissions: {
              has: "MANAGE_USERS",
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or insufficient permissions", "PROJECT_NOT_FOUND");
    }

    // Cannot remove project owner
    const ownerRole = await prisma.role.findFirst({
      where: {
        projectId,
        name: "Project Owner",
        userRoles: {
          some: { userId: collaboratorId },
        },
      },
    });

    if (ownerRole) {
      throw new ValidationError("Cannot remove project owner");
    }

    // Remove user roles first
    await prisma.userRole.deleteMany({
      where: {
        userId: collaboratorId,
        role: {
          projectId,
        },
      },
    });

    // Remove from project collaborators
    await prisma.project.update({
      where: { id: projectId },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId },
        },
      },
    });

    // Publish collaborator removed event
    // await kafkaProducer.publishEvent({
    //   type: "COLLABORATOR_REMOVED",
    //   data: {
    //     projectId,
    //     collaboratorId,
    //     removedBy: userId,
    //     removedAt: new Date().toISOString(),
    //   },
    // });
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Create task in project
 */
export const createTask = async (
  projectId: string,
  userId: string,
  taskData: {
    title: string;
    description?: string;
    assignedToId?: string;
    dueDate?: Date;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  }
): Promise<any> => {
  try {
    // Verify user has permission to create tasks
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    const userProjectRole = await prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: {
          projectId: projectId,
        },
      },
      select: {
        roleId: true,
      },
    });

    if (!userProjectRole) {
      throw new NotFoundError("User role not found for project", "USER_ROLE_NOT_FOUND");
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        taskName: taskData.title,
        description: taskData.description,
        status: taskData.status || "PENDING",
        dueDate: taskData.dueDate,
        projectId: projectId,
        assignedToId: taskData.assignedToId,
        roleId: userProjectRole.roleId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Publish task created event
    // await kafkaProducer.publishEvent({
    //   type: "TASK_CREATED",
    //   data: {
    //     taskId: task.id,
    //     projectId,
    //     createdBy: userId,
    //     assignedToId: taskData.assignedToId,
    //     title: task.title,
    //     status: task.status,
    //     createdAt: new Date().toISOString(),
    //   },
    // });

    return task;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Update task
 */
export const updateTask = async (
  taskId: string,
  userId: string,
  updateData: {
    title?: string;
    description?: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
    assignedToId?: string;
    dueDate?: Date;
  }
): Promise<any> => {
  try {
    // Verify user has access to the task's project
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          collaborators: {
            some: { id: userId },
          },
        },
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundError("Task not found or access denied", "TASK_NOT_FOUND");
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Publish task updated event
    // await kafkaProducer.publishEvent({
    //   type: "TASK_UPDATED",
    //   data: {
    //     taskId,
    //     projectId: task.project.id,
    //     updatedBy: userId,
    //     changes: Object.keys(updateData),
    //     newStatus: updateData.status,
    //     updatedAt: new Date().toISOString(),
    //   },
    // });

    return updatedTask;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get user's projects
 */
export const getUserProjects = async (userId: string): Promise<any[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        collaborators: {
          some: { id: userId },
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            collaborators: true,
            tasks: true,
          },
        },
        tasks: {
          where: {
            status: { not: "COMPLETED" },
          },
          take: 3,
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
          orderBy: { dueDate: "asc" },
        },
        roles: {
          where: {
            userRoles: {
              some: { userId },
            },
          },
          select: {
            name: true,
            permissions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects.map((project) => ({
      ...project,
      userRole: project.roles[0] || null,
      pendingTasks: project.tasks,
    }));
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get project tasks with filtering
 */
export const getProjectTasks = async (
  projectId: string,
  userId: string,
  filters: {
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
    assignedToId?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ tasks: any[]; totalCount: number; hasMore: boolean }> => {
  try {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { projectId };
    if (filters.status) where.status = filters.status;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      totalCount,
      hasMore: skip + tasks.length < totalCount,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Search projects by keyword and tech stack
 */
export const searchProjects = async (
  query?: string,
  techStacks?: string[],
  limit: number = 20
): Promise<any[]> => {
  try {
    const where: any = {};

    // Add keyword search if provided
    if (query && query.trim()) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    // Add tech stack filtering if provided
    if (techStacks && techStacks.length > 0) {
      where.techLinks = {
        some: {
          techStack: {
            OR: [
              { languages: { hasSome: techStacks } },
              { frameworks: { hasSome: techStacks } },
              { tools: { hasSome: techStacks } },
            ],
          },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        techLinks: {
          include: {
            techStack: {
              select: {
                frameworks: true,
                languages: true,
                tools: true,
              },
            },
          },
        },
        _count: {
          select: {
            collaborators: true,
            tasks: true,
          },
        },
      },
      take: limit,
      orderBy: { updatedAt: "desc" },
    });

    return projects.map((project) => ({
      ...project,
      techStacks: project.techLinks.map((link) => link.techStack),
    }));
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get project activity feed (recent events)
 */
export const getProjectActivity = async (
  projectId: string,
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    // Get recent tasks created/updated
    const recentTasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    // Transform to activity feed format
    const activities = recentTasks.map((task) => ({
      type: task.createdAt.getTime() === task.updatedAt.getTime() ? "TASK_CREATED" : "TASK_UPDATED",
      entityId: task.id,
      entityType: "TASK",
      title: task.title,
      description: `Task "${task.title}" was ${task.createdAt.getTime() === task.updatedAt.getTime() ? "created" : "updated"}`,
      status: task.status,
      assignedTo: task.assignedTo,
      timestamp: task.updatedAt,
    }));

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get project analytics and metrics
 */
export const getProjectAnalytics = async (projectId: string, userId: string): Promise<any> => {
  try {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: userId },
        },
      },
      include: {
        tasks: {
          select: {
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            collaborators: true,
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    // Calculate task statistics
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === "COMPLETED").length;
    const pendingTasks = project.tasks.filter((t) => t.status === "PENDING").length;
    const inProgressTasks = project.tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const blockedTasks = project.tasks.filter((t) => t.status === "BLOCKED").length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate average task completion time (completed tasks only)
    const completedTasksWithTime = project.tasks.filter((t) => t.status === "COMPLETED");
    const avgCompletionTime =
      completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce((sum, task) => {
            const timeToComplete = task.updatedAt.getTime() - task.createdAt.getTime();
            return sum + timeToComplete;
          }, 0) / completedTasksWithTime.length
        : 0;

    // Convert to days
    const avgCompletionDays = avgCompletionTime / (1000 * 60 * 60 * 24);

    return {
      projectId,
      overview: {
        totalTasks,
        totalCollaborators: project._count.collaborators,
        completionRate: Math.round(completionRate * 100) / 100,
      },
      taskBreakdown: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        blocked: blockedTasks,
      },
      performance: {
        avgCompletionTimeDays: Math.round(avgCompletionDays * 100) / 100,
        tasksCompletedThisWeek: project.tasks.filter(
          (t) =>
            t.status === "COMPLETED" &&
            t.updatedAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};
