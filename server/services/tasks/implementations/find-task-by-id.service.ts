import IFindTaskByIdService from "../find-task-by-id-service.interface"
import ITaskDataAccess from "../../../data-access/tasks.interface"

import { TaskDatabaseType } from "../../../types/tasks.types"

export default class FindTaskByIdService implements IFindTaskByIdService {
  private readonly taskDataAccess: ITaskDataAccess

  constructor(taskDataAccess: ITaskDataAccess) {
    this.taskDataAccess = taskDataAccess
  }

  public async execute(taskId: string): Promise<TaskDatabaseType> {
    try {
      const foundTask = await this.taskDataAccess.findById(taskId)
      return foundTask
    } catch (err) {
      throw new Error("[Service] Error to find task by id: " + err.message)
    }
  }
}
