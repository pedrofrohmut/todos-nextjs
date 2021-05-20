import ISignedController, { Request, Response } from "../signed.interface"
import ISignedUseCase from "../../../use-cases/users/signed.interface"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TokenWithoutUserIdError from "../../../errors/users/token-without-user-id.error"
import InvalidTokenError from "../../../errors/users/invalid-token.error"
import ExpiredTokenError from "../../../errors/users/expired-token.error"
import TokenWithInvalidUserIdError from "../../../errors/users/token-with-invalid-user-id.error"

export default class SignedController implements ISignedController {
  private readonly signedUseCase: ISignedUseCase

  constructor(signedUseCase: ISignedUseCase) {
    this.signedUseCase = signedUseCase
  }

  public async execute(request: Request): Promise<Response> {
    const authenticationToken = request.headers.authentication_token
    try {
      const signedData = await this.signedUseCase.execute(authenticationToken)
      return { status: 200, body: signedData }
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
