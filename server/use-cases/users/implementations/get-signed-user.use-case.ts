import IAuthenticationTokenDecoderService from "../../../services/users/authentication-token-decoder-service.interface"
import IFindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import IGetSignedUserUseCase from "../get-signed-user-use-case.interface"

import { AuthenticationTokenType, SignedUserType } from "../../../types/user.types"

import UserValidator from "../../../validators/user.validator"

import ExpiredTokenError from "../../../errors/users/expired-token.error"
import InvalidTokenError from "../../../errors/users/invalid-token.error"
import TokenWithInvalidUserIdError from "../../../errors/users/token-with-invalid-user-id.error"
import TokenWithoutUserIdError from "../../../errors/users/token-without-user-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class GetSignedUserUseCase implements IGetSignedUserUseCase {
  private readonly findUserByIdService: IFindUserByIdService
  private readonly authenticationTokenDecoderService: IAuthenticationTokenDecoderService

  constructor(
    findUserByIdService: IFindUserByIdService,
    authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  ) {
    this.findUserByIdService = findUserByIdService
    this.authenticationTokenDecoderService = authenticationTokenDecoderService
  }

  public async execute(token: string): Promise<SignedUserType> {
    let decoded: AuthenticationTokenType = undefined
    try {
      decoded = this.authenticationTokenDecoderService.execute(token)
    } catch (err) {
      if (err instanceof InvalidTokenError || err instanceof ExpiredTokenError) {
        throw err
      }
    }
    if (!decoded) {
      throw new InvalidTokenError()
    }
    if (decoded.userId === undefined) {
      throw new TokenWithoutUserIdError()
    }
    const userIdValidationMessage = UserValidator.getMessageForUserId(decoded.userId)
    if (userIdValidationMessage !== null) {
      throw new TokenWithInvalidUserIdError()
    }
    const foundUser = await this.findUserByIdService.execute(decoded.userId)
    if (!foundUser) {
      throw new UserNotFoundByIdError()
    }
    const { id, name, email } = foundUser
    return {
      id,
      name,
      email
    }
  }
}
