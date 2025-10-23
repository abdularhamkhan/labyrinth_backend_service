import z from "zod";

// =============================================================================
// PROJECT MANAGEMENT SCHEMAS - LABYRINTH PLATFORM
// =============================================================================

/**
 * TASK STATUS ENUM SCHEMA
 */
export const taskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

/**
 * PROJECT ROLE PERMISSIONS SCHEMA
 */
export const rolePermissionsSchema = z.array(
  z.enum(['READ', 'WRITE', 'DELETE', 'MANAGE_USERS', 'MANAGE_ROLES'])
);

export type RolePermissions = z.infer<typeof rolePermissionsSchema>;

/**
 * CREATE PROJECT SCHEMA
 */
export const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  workspaceName: z.string().min(1).max(50),
  workspaceDescription: z.string().max(500).optional(),
  techStackIds: z.array(z.string().uuid()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * UPDATE PROJECT SCHEMA
 */
export const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  techStackIds: z.array(z.string().uuid()).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/**
 * ADD COLLABORATOR SCHEMA
 */
export const addCollaboratorSchema = z.object({
  collaboratorId: z.string().uuid(),
  permissions: rolePermissionsSchema.default(['READ', 'WRITE']),
});

export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;

/**
 * REMOVE COLLABORATOR SCHEMA
 */
export const removeCollaboratorSchema = z.object({
  collaboratorId: z.string().uuid(),
});

export type RemoveCollaboratorInput = z.infer<typeof removeCollaboratorSchema>;

/**
 * CREATE TASK SCHEMA
 */
export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  status: taskStatusSchema.default('PENDING'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * UPDATE TASK SCHEMA
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusSchema.optional(),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * PROJECT TASKS QUERY SCHEMA
 */
export const projectTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  assignedToId: z.string().uuid().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type ProjectTasksQuery = z.infer<typeof projectTasksQuerySchema>;

/**
 * COLLABORATOR SCHEMA
 */
export const collaboratorSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  lastActive: z.date().nullable(),
  techStack: z.object({
    frameworks: z.array(z.string()),
    languages: z.array(z.string()),
    tools: z.array(z.string()),
  }).nullable(),
});

export type Collaborator = z.infer<typeof collaboratorSchema>;

/**
 * TASK SCHEMA
 */
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  dueDate: z.date().nullable(),
  assignedTo: z.object({
    id: z.string().uuid(),
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;

/**
 * PROJECT ROLE SCHEMA
 */
export const projectRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: rolePermissionsSchema,
  userRoles: z.array(z.object({
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    }),
  })),
});

export type ProjectRole = z.infer<typeof projectRoleSchema>;

/**
 * WORKSPACE SCHEMA
 */
export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

/**
 * PROJECT DETAILS SCHEMA
 */
export const projectDetailsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  workspace: workspaceSchema,
  collaborators: z.array(collaboratorSchema),
  techStacks: z.array(z.object({
    id: z.string().uuid(),
    frameworks: z.array(z.string()),
    languages: z.array(z.string()),
    tools: z.array(z.string()),
  })),
  roles: z.array(projectRoleSchema),
  tasks: z.array(taskSchema),
  _count: z.object({
    collaborators: z.number().int(),
    tasks: z.number().int(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProjectDetails = z.infer<typeof projectDetailsSchema>;

/**
 * USER PROJECT SCHEMA
 */
export const userProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  workspace: workspaceSchema,
  userRole: z.object({
    name: z.string(),
    permissions: rolePermissionsSchema,
  }).nullable(),
  pendingTasks: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    status: taskStatusSchema,
    dueDate: z.date().nullable(),
  })),
  _count: z.object({
    collaborators: z.number().int(),
    tasks: z.number().int(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProject = z.infer<typeof userProjectSchema>;

/**
 * PROJECT RESPONSE SCHEMAS
 */
export const projectResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    project: projectDetailsSchema,
  }),
});

export const projectsListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    projects: z.array(userProjectSchema),
    totalCount: z.number().int(),
  }),
});

export const taskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    task: taskSchema,
  }),
});

export const tasksListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    tasks: z.array(taskSchema),
    pagination: z.object({
      currentPage: z.number().int(),
      totalCount: z.number().int(),
      hasMore: z.boolean(),
      pageSize: z.number().int(),
    }),
  }),
});

export const collaboratorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    projectId: z.string().uuid(),
    collaboratorId: z.string().uuid(),
    roleId: z.string().uuid(),
    permissions: rolePermissionsSchema,
  }),
});

