import { TaskDatabaseType } from "../../types/tasks.types"

export default interface IFindTaskByIdService {
  execute: (taskId: string) => Promise<TaskDatabaseType>
}
