import { UserType } from "../../types/users.types"

export default interface IFindUserByEmailService {
  execute: (email: string) => Promise<UserType>
}