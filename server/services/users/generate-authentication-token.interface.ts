import { AuthenticationToken } from "../../types/users.types"

export default interface IGenerateAuthenticationTokenService {
  execute: (userId: string) => AuthenticationToken
}
