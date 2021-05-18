import { UserDatabaseType } from "../../types/users.types"

export default interface IFindUserByIdService {
  execute: (userId: string) => Promise<UserDatabaseType>
}
