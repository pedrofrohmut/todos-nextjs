import { CreateTaskType } from "../../types/task.types"

export default interface ICreateTaskUseCase {
  execute: (newTask: CreateTaskType) => Promise<void>
}
