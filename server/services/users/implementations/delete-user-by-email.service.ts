import IDeleteUserByEmailService from "../delete-user-by-email-service.interface"
import IUserDataAccess from "../../../data-access/user-data-access.interface"

export default class DeleteUserByEmailService implements IDeleteUserByEmailService {
  private readonly userDataAccess: IUserDataAccess

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
