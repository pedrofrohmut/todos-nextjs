import { TaskDatabaseType } from "../../types/task.types"

export default interface IFindTasksByUserIdService {
  execute: (userId: string) => Promise<TaskDatabaseType[]>
}
