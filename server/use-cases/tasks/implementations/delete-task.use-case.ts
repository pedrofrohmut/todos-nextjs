import IDeleteTaskByIdService from "../../../services/tasks/delete-task-by-id-service.interface"
import IDeleteTaskUseCase from "../delete-task-use-case.interface"
import IFindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import IFindUserByIdService from "../../../services/users/find-user-by-id-service.interface"

import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class DeleteTaskUseCase implements IDeleteTaskUseCase {
  private readonly findUserByIdService: IFindUserByIdService
  private readonly findTaskByIdService: IFindTaskByIdService
  private readonly deleteTaskByIdService: IDeleteTaskByIdService

  constructor(
    findUserByIdService: IFindUserByIdService,
    findTaskByIdService: IFindTaskByIdService,
    deleteTaskByIdService: IDeleteTaskByIdService
  ) {
    this.findUserByIdService = findUserByIdService
    this.findTaskByIdService = findTaskByIdService
    this.deleteTaskByIdService = deleteTaskByIdService
  }

  public async execute(userId: string, taskId: string): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError()
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError()
    }
    await this.deleteTaskByIdService.execute(taskId)
  }
}
