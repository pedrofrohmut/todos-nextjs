import { Client } from "pg"

import { CreateUserDatabaseType, UserType } from "../types/user"

export default class UserDataAccess {
  private connection: Client

  public constructor(connection: Client) {
    this.connection = connection
  }

  public async findByEmail(userEmail: string): Promise<UserType> {
    const result = await this.connection.query("SELECT * FROM app.users WHERE email = $1", [
      userEmail
    ])
    const { id, name, email, password_hash } = result.rows[0]
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }

  public async create({ name, email, passwordHash }: CreateUserDatabaseType): Promise<void> {
    await this.connection.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    )
  }
}
