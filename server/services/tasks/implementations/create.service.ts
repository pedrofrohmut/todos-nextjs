import ICreateTaskService from "../create.interface"
import ITaskDataAccess from "../../../data-access/tasks.interface"

import { CreateTaskType } from "../../../types/tasks.types"

export default class CreateTaskService implements ICreateTaskService {
  private readonly taskDataAccess: ITaskDataAccess

  constructor(taskDataAccess: ITaskDataAccess) {
    this.taskDataAccess = taskDataAccess
  }

  public async execute({
    name,
    description: taskDescription,
    userId
  }: CreateTaskType): Promise<void> {
    const description = taskDescription === undefined ? "" : taskDescription
    try {
      await this.taskDataAccess.create({ name, description, userId })
    } catch (err) {
      throw new Error("[Service] Error to create a task: " + err.message)
    }
  }
}
