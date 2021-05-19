import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken"
import ExpiredTokenError from "../../../errors/users/expired-token.error"
import InvalidTokenError from "../../../errors/users/invalid-token.error"

import { AuthenticationToken } from "../../../types/users.types"
import IAuthenticationTokenDecoderService from "../authentication-token-decoder.interface"

export default class AuthenticationTokenDecoderService
  implements IAuthenticationTokenDecoderService {
  public execute(token: string): AuthenticationToken {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET) as AuthenticationToken
      return decodedToken
    } catch (err) {
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
