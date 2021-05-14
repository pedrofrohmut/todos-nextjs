import { CreateUserType } from "../../../types/users"

export default interface ICreateUserService {
  execute: (newUser: CreateUserType) => Promise<void>
}
