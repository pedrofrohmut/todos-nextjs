import { SignInCredentialsType, SignInDataType } from "../../types/users.types"

export default interface ISignInUseCase {
  execute: (credentials: SignInCredentialsType) => Promise<SignInDataType>
}
