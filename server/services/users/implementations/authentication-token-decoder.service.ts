import { verify } from "jsonwebtoken"

import { AuthenticationToken } from "../../../types/users.types"
import IAuthenticationTokenDecoderService from "../authentication-token-decoder.interface"

export default class AuthenticationTokenDecoderService
  implements IAuthenticationTokenDecoderService {
  public execute(token: string): AuthenticationToken {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET) as AuthenticationToken
      return decodedToken
    } catch (err) {
      throw new Error("Error to decode authentication token: " + err.message)
    }
  }
}
