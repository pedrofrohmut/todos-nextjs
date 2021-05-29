import ITaskDataAccess from "../task-data-access.interface"

import { CreateTaskDatabaseType, TaskDatabaseType } from "../../types/task.types"
import { TaskSQLType } from "../sql.types"

import { Connection } from "../../utils/connection-factory.util"

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
    const { id, name, description, user_id } = result.rows[0] as TaskSQLType
    return {
      id,
      name,
      description,
      userId: user_id
    }
  }

  public async findByUserId(userId: string): Promise<TaskDatabaseType[]> {
    const result = await this.connection.query(
      "SELECT id, name, description FROM app.tasks WHERE user_id = $1",
      [userId]
    )
    if (result.rows.length === 0) {
      return []
    }
    const tasks = result.rows.map(({ id, name, description }: TaskSQLType) => ({
      id,
      name,
      description,
      userId
    }))
    return tasks
  }
}
