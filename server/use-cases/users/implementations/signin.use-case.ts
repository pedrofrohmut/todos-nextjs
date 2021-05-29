import ISignInUseCase from "../signin-use-case.interface"
import ICheckPasswordService from "../../../services/users/check-password-service.interface"
import IFindUserByEmailService from "../../../services/users/find-user-by-email-service.interface"
import IGenerateTokenService from "../../../services/users/generate-authentication-token-service.interface"

import { SignInCredentialsType, SignInDataType } from "../../../types/user.types"

import UserNotFoundByEmailError from "../../../errors/users/user-not-found-by-email.error"
import PasswordIsNotAMatchError from "../../../errors/users/password-is-not-a-match.error"

export default class SignInUseCase implements ISignInUseCase {
  private readonly findUserByEmailService: IFindUserByEmailService
  private readonly checkPasswordService: ICheckPasswordService
  private readonly generateTokenService: IGenerateTokenService

  constructor(
    findUserByEmailService: IFindUserByEmailService,
    checkPasswordService: ICheckPasswordService,
    generateTokenService: IGenerateTokenService
  ) {
    this.findUserByEmailService = findUserByEmailService
    this.checkPasswordService = checkPasswordService
    this.generateTokenService = generateTokenService
  }

  public async execute({ email, password }: SignInCredentialsType): Promise<SignInDataType> {
    const foundUser = await this.findUserByEmailService.execute(email)
    if (!foundUser) {
      throw new UserNotFoundByEmailError()
    }
    const { id, name, passwordHash } = foundUser
    const isMatch = await this.checkPasswordService.execute(password, passwordHash)
    if (!isMatch) {
      throw new PasswordIsNotAMatchError()
    }
    const token = this.generateTokenService.execute(foundUser.id)
    return {
      user: {
        id,
        name,
        email
      },
      token
    }
  }
}
