import { CreateUserType } from "../../types/users.types"

export default interface ICreateUserUseCase {
  execute: (newUser: CreateUserType) => Promise<void>
}
