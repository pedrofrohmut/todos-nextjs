import ICreateUserUseCase from "./interface"
import { CreateUserType } from "../../../types/users"
import { EmailAlreadyInUseError } from "../../../errors/users/email-already-in-use"
import IFindUserByEmailService from "../../../services/users/find-by-email/interface"
import ICreateUserService from "../../../services/users/create/interface"

export default class CreateUserUseCase implements ICreateUserUseCase {
  private findUserByEmailService: IFindUserByEmailService
  private createUserService: ICreateUserService

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
