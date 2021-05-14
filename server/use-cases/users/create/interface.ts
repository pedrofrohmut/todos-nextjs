import { CreateUserType } from "../../../types/users"

export default interface ICreateUserUseCase {
  execute: (newUser: CreateUserType) => Promise<void>
}
