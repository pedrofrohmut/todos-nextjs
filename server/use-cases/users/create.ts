import { CreateUserType } from "../../types/user"
import ConnectionFactory, { Connection } from "../../utils/connection-factory"
import findUserByEmailService from "../../services/users/find-by-email"
import generatePasswordHashService from "../../services/users/generate-password-hash"
import createUserService from "../../services/users/create"
import { EmailAlreadyInUseError } from "../../errors/user"

export default class CreateUserUseCase {
  private connection: Connection

  public constructor() {
    this.connection = ConnectionFactory.getConnection()
  }

  public async execute({ name, email, password }: CreateUserType): Promise<void> {
    await ConnectionFactory.connect(this.connection)
    const foundUser = await findUserByEmailService(this.connection, email)
    if (foundUser !== null) {
      throw new EmailAlreadyInUseError()
    }
    const passwordHash = await generatePasswordHashService(password)
    await createUserService(this.connection, { name, email, passwordHash })
    await ConnectionFactory.closeConnection(this.connection)
  }
}
