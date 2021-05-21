import { sign } from "jsonwebtoken"
import { AuthenticationToken } from "../../../types/users.types"

import IGenerateAuthenticationTokenService from "../generate-authentication-token.interface"

export default class GenerateAuthenticationTokenService
  implements IGenerateAuthenticationTokenService {
  public execute(userId: string): AuthenticationToken {
    const oneDay = 24 * 60 * 60
    try {
      const token: unknown = sign({ userId }, process.env.JWT_SECRET, { expiresIn: oneDay })
      return token as AuthenticationToken
    } catch (err) {
      throw new Error("[Service] Error to generate authentication token: " + err.message)
    }
  }
}
