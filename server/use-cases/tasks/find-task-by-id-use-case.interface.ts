import { TaskType } from "../../types/task.types"

export default interface IFindTaskByIdUseCase {
  execute: (userId: string, taskId: string) => Promise<TaskType>
}
