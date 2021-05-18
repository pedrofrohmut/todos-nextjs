import { UserDatabaseType } from "../../../types/users.types"
import IFindUserByEmailService from "../find-by-email.interface"
import IUserDataAccess from "../../../data-access/users.interface"

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
