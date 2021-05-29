export type CreateTaskDatabaseType = {
  name: string
  description: string
  userId: string
}

export type CreateTaskType = {
  name: string
  description?: string
  userId: string
}

export type TaskDatabaseType = {
  id: string
  name: string
  description: string
  userId: string
}

export type TaskType = {
  id: string
  name: string
  description?: string
}
