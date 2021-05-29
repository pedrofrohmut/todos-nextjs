import { TaskType } from "../../types/task.types"

export default interface IFindTasksByUserIdUseCase {
  execute: (userId: string) => Promise<TaskType[]>
}
