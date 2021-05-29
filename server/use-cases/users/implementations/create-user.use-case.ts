import ICreateUserService from "../../../services/users/create-user-service.interface"
import IFindUserByEmailService from "../../../services/users/find-user-by-email-service.interface"
import ICreateUserUseCase from "../create-user-use-case.interface"

import { CreateUserType } from "../../../types/user.types"

import EmailAlreadyInUseError from "../../../errors/users/email-already-in-use.error"

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
