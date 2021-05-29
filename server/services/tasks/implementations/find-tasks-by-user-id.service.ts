import IFindTasksByUserIdService from "../find-tasks-by-user-id-service.interface"
import ITaskDataAccess from "../../../data-access/task-data-access.interface"

import { TaskDatabaseType } from "../../../types/task.types"

export default class FindTasksByUserIdService implements IFindTasksByUserIdService {
  private readonly taskDataAccess: ITaskDataAccess

  constructor(taskDataAccess: ITaskDataAccess) {
    this.taskDataAccess = taskDataAccess
  }

  public async execute(userId: string): Promise<TaskDatabaseType[]> {
    try {
      const tasks = await this.taskDataAccess.findByUserId(userId)
      return tasks
    } catch (err) {
      throw new Error("[Service] Error to find tasks by user id: " + err.message)
    }
  }
}
