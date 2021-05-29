import { UserDatabaseType } from "../../types/user.types"

export default interface IFindUserByIdService {
  execute: (userId: string) => Promise<UserDatabaseType>
}
