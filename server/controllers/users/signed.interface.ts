import { AuthenticationHeaders, SignedUserType } from "../../types/users.types"

export type SignedRequestType = {
  headers: AuthenticationHeaders
}

export type SignedResponseType = {
  status: 200 | 400
  body: SignedUserType | string
}

export default interface ISignedController {
  execute: (request: SignedRequestType) => Promise<SignedResponseType>
}
