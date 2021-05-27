import { CreateTaskDatabaseType } from "../../types/tasks.types"
import { Connection } from "../../utils/connection-factory.util"
import ITaskDataAccess from "../tasks.interface"

export default class TaskDataAccess implements ITaskDataAccess {
  private readonly connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  public async create({ name, description, userId }: CreateTaskDatabaseType): Promise<void> {
    await this.connection.query(
      "INSERT INTO app.tasks (name, description, user_id) VALUES ($1, $2, $3)",
      [name, description, userId]
    )
  }
}
