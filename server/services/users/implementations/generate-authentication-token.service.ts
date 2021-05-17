import { sign } from "jsonwebtoken"

import IGenerateAuthenticationTokenService from "../generate-authentication-token.interface"

export default class GenerateAuthenticationTokenService
  implements IGenerateAuthenticationTokenService {
  public async execute(userId: string): Promise<string> {
    try {
      const token = sign({ userId }, process.env.JWT_SECRET)
      return token
    } catch (err) {
      throw new Error("[Service] Error to generate authentication token: " + err.message)
    }
  }
}
