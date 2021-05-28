import { CreateTaskDatabaseType, TaskDatabaseType } from "../types/tasks.types"

export default interface ITaskDataAccess {
  create: (newTask: CreateTaskDatabaseType) => Promise<void>
  deleteById: (taskId: string) => Promise<void>
  findById: (taskId: string) => Promise<TaskDatabaseType>
}
