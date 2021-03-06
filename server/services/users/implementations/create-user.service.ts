import ICreateUserService from "../create-user-service.interface"
import IUserDataAccess from "../../../data-access/user-data-access.interface"
import IGeneratePasswordHashService from "../generate-password-hash-service.interface"
import { CreateUserType } from "../../../types/user.types"

export default class CreateUserService implements ICreateUserService {
  private readonly generatePasswordHashService: IGeneratePasswordHashService
  private readonly userDataAccess: IUserDataAccess

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
