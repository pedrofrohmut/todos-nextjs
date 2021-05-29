import IGetSignedUserController, {
  GetSignedUserRequestType,
  GetSignedUserResponseType
} from "../get-signed-user-controller.interface"
import IGetSignedUserUseCase from "../../../use-cases/users/get-signed-user-use-case.interface"

import ExpiredTokenError from "../../../errors/users/expired-token.error"
import InvalidTokenError from "../../../errors/users/invalid-token.error"
import TokenWithInvalidUserIdError from "../../../errors/users/token-with-invalid-user-id.error"
import TokenWithoutUserIdError from "../../../errors/users/token-without-user-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class GetSignedUserController implements IGetSignedUserController {
  private readonly getSignedUserUseCase: IGetSignedUserUseCase

  constructor(getSignedUserUseCase: IGetSignedUserUseCase) {
    this.getSignedUserUseCase = getSignedUserUseCase
  }

  public async execute(request: GetSignedUserRequestType): Promise<GetSignedUserResponseType> {
    const authenticationToken = request.headers.authentication_token
    try {
      const signedUserData = await this.getSignedUserUseCase.execute(authenticationToken)
      return { status: 200, body: signedUserData }
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        return { status: 400, body: InvalidTokenError.message }
      }
      if (err instanceof ExpiredTokenError) {
        return { status: 400, body: ExpiredTokenError.message }
      }
      if (err instanceof TokenWithoutUserIdError) {
        return { status: 400, body: TokenWithoutUserIdError.message }
      }
      if (err instanceof TokenWithInvalidUserIdError) {
        return { status: 400, body: TokenWithInvalidUserIdError.message }
      }
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: UserNotFoundByIdError.message }
      }
      throw err
    }
  }
}
