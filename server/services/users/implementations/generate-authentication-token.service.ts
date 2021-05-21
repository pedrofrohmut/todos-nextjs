import { sign } from "jsonwebtoken"

import IGenerateAuthenticationTokenService from "../generate-authentication-token.interface"

export default class GenerateAuthenticationTokenService
  implements IGenerateAuthenticationTokenService {
  public execute(userId: string): string {
    const oneDay = 24 * 60 * 60
    try {
      const token = sign({ userId }, process.env.JWT_SECRET, { expiresIn: oneDay })
      return token
    } catch (err) {
      throw new Error("[Service] Error to generate authentication token: " + err.message)
    }
  }
}
