import { UserDatabaseType } from "../../../types/users.types"
import IFindUserByIdService from "../find-by-id.interface"
import IUserDataAccess from "../../../data-access/users.interface"

export default class FindUserByIdService implements IFindUserByIdService {
  private readonly userDataAccess: IUserDataAccess

  constructor(userDataAccess: IUserDataAccess) {
    this.userDataAccess = userDataAccess
  }

  public async execute(userId: string): Promise<UserDatabaseType> {
    try {
      const foundUser = await this.userDataAccess.findById(userId)
      return foundUser
    } catch (err) {
      throw new Error("Error to find user by id: " + err.message)
    }
  }
}
