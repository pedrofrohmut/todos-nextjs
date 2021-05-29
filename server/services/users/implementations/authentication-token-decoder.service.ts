import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken"
import ExpiredTokenError from "../../../errors/users/expired-token.error"
import InvalidTokenError from "../../../errors/users/invalid-token.error"

import { AuthenticationTokenType } from "../../../types/user.types"
import IAuthenticationTokenDecoderService from "../authentication-token-decoder-service.interface"

export default class AuthenticationTokenDecoderService
  implements IAuthenticationTokenDecoderService {
  public execute(token: string): AuthenticationTokenType {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET) as AuthenticationTokenType
      return decodedToken
    } catch (err) {
      // TokenExpiredError must precede other errors. Lib inheritance issues
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenError()
      }
      if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        throw new InvalidTokenError()
      }
      throw new Error("Error to decode authentication token: " + err.message)
    }
  }
}
