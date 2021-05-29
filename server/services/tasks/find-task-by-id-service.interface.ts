import { TaskDatabaseType } from "../../types/task.types"

export default interface IFindTaskByIdService {
  execute: (taskId: string) => Promise<TaskDatabaseType>
}
