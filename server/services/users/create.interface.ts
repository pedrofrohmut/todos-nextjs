import { CreateUserType } from "../../types/users.types"

export default interface ICreateUserService {
  execute: (newUser: CreateUserType) => Promise<void>
}
