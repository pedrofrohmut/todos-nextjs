import { CreateUserType } from "../../types/user.types"

export default interface ICreateUserUseCase {
  execute: (newUser: CreateUserType) => Promise<void>
}
