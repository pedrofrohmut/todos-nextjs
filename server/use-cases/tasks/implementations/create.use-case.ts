import ICreateTaskUseCase from "../create.interface"
import IFindUserByIdService from "../../../services/users/find-by-id.interface"
import ICreateTaskService from "../../../services/tasks/create.interface"

import { CreateTaskType } from "../../../types/tasks.types"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreateTaskUseCase implements ICreateTaskUseCase {
  private readonly findUserByIdService: IFindUserByIdService
  private readonly createTaskService: ICreateTaskService

  constructor(findUserByIdService: IFindUserByIdService, createTaskService: ICreateTaskService) {
    this.findUserByIdService = findUserByIdService
    this.createTaskService = createTaskService
  }

  public async execute(newTask: CreateTaskType): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(newTask.userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError()
    }
    await this.createTaskService.execute(newTask)
  }
}
