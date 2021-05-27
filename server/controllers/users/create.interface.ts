import { CreateUserType } from "../../types/users.types"

export type CreateUserRequestType = {
  body: CreateUserType
}

export type CreateUserResponseType = {
  status: 201 | 400
  body?: string
}

export default interface ICreateUserController {
  execute: (request: CreateUserRequestType) => Promise<CreateUserResponseType>
}
