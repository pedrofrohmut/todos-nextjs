import { CreateUserType } from "../../types/user.types"

export default interface ICreateUserService {
  execute: (newUser: CreateUserType) => Promise<void>
}
