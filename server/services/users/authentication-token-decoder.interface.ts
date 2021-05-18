import { AuthenticationToken } from "../../types/users.types"

export default interface IAuthenticationTokenDecoderService {
  execute: (token: string) => AuthenticationToken
}
