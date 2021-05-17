import ICreateUserService from "../create.interface"
import IUserDataAccess from "../../../data-access/users.interface"
import IGeneratePasswordHashService from "../generate-password-hash.interface"
import { CreateUserType } from "../../../types/users.types"

export default class CreateUserService implements ICreateUserService {
  private generatePasswordHashService: IGeneratePasswordHashService
  private userDataAccess: IUserDataAccess

  constructor(
    generatePasswordHashService: IGeneratePasswordHashService,
    userDataAccess: IUserDataAccess
  ) {
    this.generatePasswordHashService = generatePasswordHashService
    this.userDataAccess = userDataAccess
  }

  public async execute({ name, email, password }: CreateUserType): Promise<void> {
    const passwordHash = await this.generatePasswordHashService.execute(password)
    try {
      await this.userDataAccess.create({ name, email, passwordHash })
    } catch (err) {
      throw new Error("[Service] Error to create an user: " + err.message)
    }
  }
}
