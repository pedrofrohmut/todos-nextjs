import { CreateUserDatabaseType, UserDatabaseType } from "../types/user.types"

export default interface IUserDataAccess {
  create: (newUser: CreateUserDatabaseType) => Promise<void>
  createAndReturn: (newUser: CreateUserDatabaseType) => Promise<UserDatabaseType>
  deleteByEmail: (email: string) => Promise<void>
  deleteById: (userId: string) => Promise<void>
  findByEmail: (email: string) => Promise<UserDatabaseType | null>
  findById: (userId: string) => Promise<UserDatabaseType | null>
}
