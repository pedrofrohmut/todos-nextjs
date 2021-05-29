import { UserDatabaseType } from "../../types/user.types"

export default interface IFindUserByEmailService {
  execute: (email: string) => Promise<UserDatabaseType>
}
