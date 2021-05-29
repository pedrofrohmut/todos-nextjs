export type CreateTaskType = {
  name: string
  description?: string
  userId: string
}

export type CreateTaskDatabaseType = {
  name: string
  description: string
  userId: string
}

export type TaskDatabaseType = {
  id: string
  name: string
  description: string
  userId: string
}
