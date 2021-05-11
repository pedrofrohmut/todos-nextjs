import { Client } from "pg"

import { CreateUserType } from "../../types/user"
import ConnectionFactory from "../../utils/connection-factory"
import findUserByEmailService from "../../services/users/find-by-email"
import generatePasswordHashService from "../../services/users/generate-password-hash"
import createUserService from "../../services/users/create"
import { EmailAlreadyInUseError } from "../../errors/user"

export default class CreateUserUseCase {
  private connection: Client

  public constructor() {
    this.connection = ConnectionFactory.getConnection()
  }

  public async execute({ name, email, password }: CreateUserType): Promise<void> {
    await this.connection.connect()
    const foundUser = await findUserByEmailService(this.connection, email)
    if (foundUser !== null) {
      throw new EmailAlreadyInUseError()
    }
    const passwordHash = await generatePasswordHashService(password)
    await createUserService(this.connection, { name, email, password, passwordHash })
  }
}
