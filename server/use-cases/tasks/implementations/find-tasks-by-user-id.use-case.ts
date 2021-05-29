import IFindTasksByUserIdUseCase from "../find-tasks-by-user-id-use-case.interface"
import IFindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import IFindTasksByUserIdService from "../../../services/tasks/find-tasks-by-user-id-service.interface"

import { TaskDatabaseType, TaskType } from "../../../types/task.types"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class FindTasksByUserIdUseCase implements IFindTasksByUserIdUseCase {
  private readonly findUserByIdService: IFindUserByIdService
  private readonly findTasksByUserIdService: IFindTasksByUserIdService

  constructor(
    findUserByIdService: IFindUserByIdService,
    findTasksByUserIdService: IFindTasksByUserIdService
  ) {
    this.findUserByIdService = findUserByIdService
    this.findTasksByUserIdService = findTasksByUserIdService
  }

  public async execute(userId: string): Promise<TaskType[]> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError()
    }
    const tasksDatabase = await this.findTasksByUserIdService.execute(userId)
    const tasks = tasksDatabase.map((task: TaskDatabaseType) => ({
      id: task.id,
      name: task.name,
      description: task.description || ""
    }))
    return tasks
  }
}
