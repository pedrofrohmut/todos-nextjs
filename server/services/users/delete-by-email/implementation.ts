import IDeleteUserByEmailService from "./interface"
import IUserDataAccess from "../../../data-access/users/interface"

export default class DeleteUserByEmailService implements IDeleteUserByEmailService {
  private userDataAccess: IUserDataAccess

  constructor(userDataAccess: IUserDataAccess) {
    this.userDataAccess = userDataAccess
  }

  public async execute(email: string): Promise<void> {
    try {
      await this.userDataAccess.deleteByEmail(email)
    } catch (err) {
      throw new Error("[Service] Error to delete user by e-mail: " + err.message)
    }
  }
}
