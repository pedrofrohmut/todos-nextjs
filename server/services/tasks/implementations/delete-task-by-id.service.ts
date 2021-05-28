import ITaskDataAccess from "../../../data-access/tasks.interface";
import IDeleteTaskByIdService from "../delete-task-by-id-service.interface";

export default class DeleteTaskByIdService implements IDeleteTaskByIdService {
  private readonly taskDataAccess: ITaskDataAccess

  constructor(taskDataAccess: ITaskDataAccess) {
    this.taskDataAccess = taskDataAccess
  }

  public async execute(taskId: string): Promise<void> {
    try {
      await this.taskDataAccess.deleteById(taskId)
    } catch (err) {
      throw new Error("[Service] Error to delete task by id: " + err.message)
    }
  }
}
