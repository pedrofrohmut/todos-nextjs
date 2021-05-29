import IFindTaskByIdUseCase from "../find-task-by-id-use-case.interface"

import { TaskType } from "../../../types/task.types"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import IFindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import IFindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"

export default class FindTaskByIdUseCase implements IFindTaskByIdUseCase {
  private readonly findUserByIdService: IFindUserByIdService
  private readonly findTaskByIdService: IFindTaskByIdService

  constructor(
    findUserByIdService: IFindUserByIdService,
    findTaskByIdService: IFindTaskByIdService
  ) {
    this.findUserByIdService = findUserByIdService
    this.findTaskByIdService = findTaskByIdService
  }

  public async execute(userId: string, taskId: string): Promise<TaskType> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError()
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError()
    }
    if (foundTask.description == undefined) {
      foundTask.description = ""
    }
    const { id, name, description } = foundTask
    return {
      id,
      name,
      description
    }
  }
}
