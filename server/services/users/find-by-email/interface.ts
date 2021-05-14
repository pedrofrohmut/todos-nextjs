import { UserType } from "../../../types/users"

export default interface IFindUserByEmailService {
  execute: (email: string) => Promise<UserType>
}
