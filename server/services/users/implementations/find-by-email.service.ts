import IFindUserByEmailService from "../find-by-email.interface"
import { UserType } from "../../../types/users.types"
import IUserDataAccess from "../../../data-access/users.interface"

export default class FindUserByEmailService implements IFindUserByEmailService {
  private userDataAccess: IUserDataAccess

  constructor(userDataAccess: IUserDataAccess) {
    this.userDataAccess = userDataAccess
  }

  public async execute(email: string): Promise<UserType> {
    try {
      const foundUser = await this.userDataAccess.findByEmail(email)
      return foundUser
    } catch (err) {
      throw new Error("Error to find user by e-mail: " + err.message)
    }
  }
}
