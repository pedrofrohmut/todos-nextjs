import { CreateTaskDatabaseType } from "../types/tasks.types"

export default interface ITaskDataAccess {
  create: (newTask: CreateTaskDatabaseType) => Promise<void>
}
