import { UserDatabaseType } from "../../../types/user.types"
import IFindUserByIdService from "../find-user-by-id-service.interface"
import IUserDataAccess from "../../../data-access/user-data-access.interface"

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
