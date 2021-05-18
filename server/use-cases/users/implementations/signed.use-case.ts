import ISignedUseCase from "../signed.interface"
import { SignedUserType } from "../../../types/users.types"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TokenWithoutUserIdError from "../../../errors/users/token-without-user-id.error"
import IAuthenticationTokenDecoderService from "../../../services/users/authentication-token-decoder.interface"
import IFindUserByIdService from "../../../services/users/find-by-id.interface"

export default class SignedUseCase implements ISignedUseCase {
  private readonly authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private readonly findUserByIdService: IFindUserByIdService

  constructor(
    findUserByIdService: IFindUserByIdService,
    authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  ) {
    this.authenticationTokenDecoderService = authenticationTokenDecoderService
    this.findUserByIdService = findUserByIdService
  }

  public async execute(token: string): Promise<SignedUserType> {
    const { userId } = this.authenticationTokenDecoderService.execute(token)
    if (!userId) {
      throw new TokenWithoutUserIdError()
    }
    const foundUser = await this.findUserByIdService.execute(userId)
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
