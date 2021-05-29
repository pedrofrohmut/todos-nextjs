import { AuthenticationHeaders, SignedUserType } from "../../types/user.types"

export type GetSignedUserRequestType = {
  headers: AuthenticationHeaders
}

export type GetSignedUserResponseType = {
  status: 200 | 400
  body: SignedUserType | string
}

export default interface IGetSignedUserController {
  execute: (request: GetSignedUserRequestType) => Promise<GetSignedUserResponseType>
}
