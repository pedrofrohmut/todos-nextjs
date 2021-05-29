import { SignInCredentialsType, SignInDataType } from "../../types/user.types"

export default interface ISignInUseCase {
  execute: (credentials: SignInCredentialsType) => Promise<SignInDataType>
}
