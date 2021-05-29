import { CreateTaskType } from "../../types/task.types"

export default interface ICreateTaskService {
  execute: (newTask: CreateTaskType) => Promise<void>
}
