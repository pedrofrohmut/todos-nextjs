import { SignInCredentialsType, SignInDataType } from "../../types/users.types"

export type SignInRequestType = {
  body: SignInCredentialsType
}

export type SignInResponseType = {
  status: 200 | 400
  body: SignInDataType | string
}

export default interface ISignInController {
  execute: (request: SignInRequestType) => Promise<SignInResponseType>
}
