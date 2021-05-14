import { CreateUserDatabaseType, UserDatabaseType } from "../../types/users"

export default interface IUserDataAccess {
  create: (newUser: CreateUserDatabaseType) => Promise<void>
  deleteByEmail: (email: string) => Promise<void>
  findByEmail: (email: string) => Promise<UserDatabaseType | null>
}
