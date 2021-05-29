import IUserDataAccess from "../user-data-access.interface"
import { Connection } from "../../utils/connection-factory.util"
import { CreateUserDatabaseType, UserDatabaseType } from "../../types/user.types"
import { UserSQLType } from "../sql.types"

export default class UserDataAccess implements IUserDataAccess {
  private readonly connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  public async create({ name, email, passwordHash }: CreateUserDatabaseType): Promise<void> {
    await this.connection.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    )
  }

  public async createAndReturn({
    name,
    email,
    passwordHash
  }: CreateUserDatabaseType): Promise<UserDatabaseType> {
    const result = await this.connection.query(
      `INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [name, email, passwordHash]
    )
    if (result.rows.length === 0) {
      return null
    }
    const { id } = result.rows[0] as UserSQLType
    return {
      id,
      name,
      email,
      passwordHash
    }
  }

  public async deleteByEmail(email: string): Promise<void> {
    await this.connection.query("DELETE FROM app.users WHERE email = $1", [email])
  }

  public async deleteById(userId: string): Promise<void> {
    await this.connection.query("DELETE FROM app.users WHERE id = $1", [userId])
  }

  public async findByEmail(email: string): Promise<UserDatabaseType> {
    const result = await this.connection.query("SELECT * FROM app.users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return null
    }
    const { id, name, password_hash } = result.rows[0] as UserSQLType
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }

  public async findById(userId: string): Promise<UserDatabaseType> {
    const result = await this.connection.query("SELECT * FROM app.users WHERE id = $1", [userId])
    if (result.rows.length === 0) {
      return null
    }
    const { name, email, password_hash } = result.rows[0] as UserSQLType
    return {
      id: userId,
      name,
      email,
      passwordHash: password_hash
    }
  }
}
