import { Connection } from "../utils/connection-factory"
import { CreateUserDatabaseType, UserDatabaseType } from "../types/user"

export default class UserDataAccess {
  private connection: Connection

  public constructor(connection: Connection) {
    this.connection = connection
  }

  public async create({ name, email, passwordHash }: CreateUserDatabaseType): Promise<void> {
    await this.connection.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    )
  }

  public async deleteByEmail(email: string): Promise<void> {
    await this.connection.query("DELETE FROM app.users WHERE email = $1", [email])
  }

  public async findByEmail(email: string): Promise<UserDatabaseType> {
    const result = await this.connection.query("SELECT * FROM app.users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return null
    }
    const { id, name, password_hash } = result.rows[0]
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }
}
