import { Connection } from "../utils/connection-factory"
import { CreateUserDatabaseType, UserType } from "../types/user"

export default class UserDataAccess {
  private connection: Connection

  public constructor(connection: Connection) {
    this.connection = connection
  }

  public async findByEmail(userEmail: string): Promise<UserType> {
    const result = await this.connection.query("SELECT * FROM app.users WHERE email = $1", [
      userEmail
    ])
    if (result.rows.length === 0) {
      return null
    }
    const { id, name, email, password_hash } = result.rows[0]
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }

  public async create({ name, email, passwordHash }: CreateUserDatabaseType): Promise<void> {
    this.connection.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    )
  }
}
