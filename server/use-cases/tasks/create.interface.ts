import { CreateTaskType } from "../../types/tasks.types"

export default interface ICreateTaskUseCase {
  execute: (newTask: CreateTaskType) => Promise<void>
}
