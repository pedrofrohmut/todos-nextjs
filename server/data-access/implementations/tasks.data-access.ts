import { CreateTaskDatabaseType, TaskDatabaseType } from "../../types/tasks.types"
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

  public async deleteById(taskId: string): Promise<void> {
    await this.connection.query("DELETE FROM app.tasks WHERE id = $1", [taskId])
  }

  public async findById(taskId: string): Promise<TaskDatabaseType> {
    const result = await this.connection.query(
      "SELECT id, name, description, user_id FROM app.tasks WHERE id = $1",
      [taskId]
    )
    if (result.rows.length === 0) {
      return null
    }
    const { id, name, description, user_id } = result.rows[0]
    return {
      id,
      name,
      description,
      userId: user_id
    }
  }
}
