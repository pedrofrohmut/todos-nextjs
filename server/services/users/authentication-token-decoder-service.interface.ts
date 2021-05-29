import { AuthenticationTokenType } from "../../types/user.types"

export default interface IAuthenticationTokenDecoderService {
  execute: (token: string) => AuthenticationTokenType
}
