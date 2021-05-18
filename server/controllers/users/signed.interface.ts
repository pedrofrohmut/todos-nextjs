import { SignedUserType } from "../../types/users.types"

export type Request = {
  headers: {
    authentication_token: string
  }
}

export type Response = {
  status: number
  body: SignedUserType | string
}

export default interface ISignedController {
  execute: (request: Request) => Promise<Response>
}
