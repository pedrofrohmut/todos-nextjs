import ICreateUserUseCase from "../create.interface"
import { CreateUserType } from "../../../types/users.types"
import EmailAlreadyInUseError from "../../../errors/users/email-already-in-use.error"
import IFindUserByEmailService from "../../../services/users/find-by-email.interface"
import ICreateUserService from "../../../services/users/create.interface"

export default class CreateUserUseCase implements ICreateUserUseCase {
  private readonly findUserByEmailService: IFindUserByEmailService
  private readonly createUserService: ICreateUserService

  public constructor(
    findUserByEmailService: IFindUserByEmailService,
    createUserService: ICreateUserService
  ) {
    this.findUserByEmailService = findUserByEmailService
    this.createUserService = createUserService
  }

  public async execute(newUser: CreateUserType): Promise<void> {
    const foundUser = await this.findUserByEmailService.execute(newUser.email)
    if (foundUser !== null) {
      throw new EmailAlreadyInUseError()
    }
    await this.createUserService.execute(newUser)
  }
}
