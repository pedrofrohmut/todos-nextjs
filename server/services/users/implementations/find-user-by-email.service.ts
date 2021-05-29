import { UserDatabaseType } from "../../../types/user.types"
import IFindUserByEmailService from "../find-user-by-email-service.interface"
import IUserDataAccess from "../../../data-access/user-data-access.interface"

export default class FindUserByEmailService implements IFindUserByEmailService {
  private readonly userDataAccess: IUserDataAccess

  constructor(userDataAccess: IUserDataAccess) {
    this.userDataAccess = userDataAccess
  }

  public async execute(email: string): Promise<UserDatabaseType> {
    try {
      const foundUser = await this.userDataAccess.findByEmail(email)
      return foundUser
    } catch (err) {
      throw new Error("Error to find user by e-mail: " + err.message)
    }
  }
}
