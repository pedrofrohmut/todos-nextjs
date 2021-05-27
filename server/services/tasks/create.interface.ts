import { CreateTaskType } from "../../types/tasks.types"

export default interface ICreateTaskService {
  execute: (newTask: CreateTaskType) => Promise<void>
}
