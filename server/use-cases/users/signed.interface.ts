import { AuthenticationToken, SignedUserType } from "../../types/users.types"

export default interface ISignedUseCase {
  execute: (token: string) => Promise<SignedUserType>
}
