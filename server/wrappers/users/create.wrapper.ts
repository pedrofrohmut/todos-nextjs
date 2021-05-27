import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ICreateUserController from "../../controllers/users/create.interface"

import CreateUserController from "../../controllers/users/implementations/create.controller"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import CreateUserService from "../../services/users/implementations/create.service"
import FindUserByEmailService from "../../services/users/implementations/find-by-email.service"
import GeneratePasswordHashService from "../../services/users/implementations/generate-password-hash.service"
import CreateUserUseCase from "../../use-cases/users/implementations/create.use-case"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import UserValidator from "../../validators/users.validator"
import { CreateUserType } from "../../types/users.types"

export default class CreateUserWrapper implements IControllerWrapper<CreateUserType, void> {
  private connection: Connection
  private createUserController: ICreateUserController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByEmailService = new FindUserByEmailService(userDataAccess)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    const createUserUseCase = new CreateUserUseCase(findUserByEmailService, createUserService)
    this.createUserController = new CreateUserController(createUserUseCase)
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  private validateBody({ name, email, password }: Partial<CreateUserType>): string {
    const nameValidationMessage = UserValidator.getMessageForName(name)
    if (nameValidationMessage) {
      return nameValidationMessage
    }
    const emailValidationMessage = UserValidator.getMessageForEmail(email)
    if (emailValidationMessage) {
      return emailValidationMessage
    }
    const passwordValidationMessage = UserValidator.getMessageForPassword(password)
    if (passwordValidationMessage) {
      return passwordValidationMessage
    }
    return null
  }

  public async execute(request: WrapperRequest<CreateUserType>): Promise<WrapperResponse<void>> {
    const { body } = request
    if (body === undefined) {
      return { status: 400, body: "Missing the request body" }
    }
    const validationMessage = this.validateBody(request.body)
    if (validationMessage !== null) {
      return { status: 400, body: validationMessage }
    }
    try {
      await this.init()
      const response = await this.createUserController.execute({ body })
      return response
    } catch (err) {
      return { status: 500, body: "Error to create an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
