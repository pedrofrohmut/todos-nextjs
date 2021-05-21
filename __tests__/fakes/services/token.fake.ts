import { sign, verify, TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import ExpiredTokenError from "../../../server/errors/users/expired-token.error"
import InvalidTokenError from "../../../server/errors/users/invalid-token.error"
import {AuthenticationToken} from "../../../server/types/users.types"

const oneDay = 24 * 60 * 60

export default class FakeTokenService {
  public static getExpired(): string {
    const expiredToken = sign({ userId: uuid() }, process.env.JWT_SECRET, { expiresIn: 0 })
    return expiredToken
  }

  public static getInvalid(): string {
    return "__INVALID_TOKEN__"
  }

  public static getWithoutUserId(): string {
    const tokenWithoutUserId = sign({}, process.env.JWT_SECRET, { expiresIn: oneDay })
    return tokenWithoutUserId
  }

  public static getWithIvalidUserId(): string {
    const invalidUserId = "___INVALID_USER_ID__"
    const tokenWithInvalidUserId = sign({ userId: invalidUserId }, process.env.JWT_SECRET, { expiresIn: oneDay })
    return tokenWithInvalidUserId
  }

  public static decodeToken(token: string): AuthenticationToken {
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as AuthenticationToken
      return decoded
    } catch (err) {
      if (err instanceof ExpiredTokenError) {
        throw new ExpiredTokenError()
      }
      if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        throw new InvalidTokenError()
      }
      throw err
    }
  }
}
