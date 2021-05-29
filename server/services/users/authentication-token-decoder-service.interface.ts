import { AuthenticationToken } from "../../types/user.types"

export default interface IAuthenticationTokenDecoderService {
  execute: (token: string) => AuthenticationToken
}
