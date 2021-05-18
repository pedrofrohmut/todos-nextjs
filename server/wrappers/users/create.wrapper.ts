import IControllerWrapper from "../controller-wrapper.interface"
import ICreateUserController, {
  Request,
  RequestBody,
  Response
} from "../../controllers/users/create.interface"
import CreateUserController from "../../controllers/users/implementations/create.controller"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import CreateUserService from "../../services/users/implementations/create.service"
import FindUserByEmailService from "../../services/users/implementations/find-by-email.service"
import GeneratePasswordHashService from "../../services/users/implementations/generate-password-hash.service"
import CreateUserUseCase from "../../use-cases/users/implementations/create.use-case"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../validators/users.validator"

export default class CreateUserWrapper implements IControllerWrapper {
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

  private validateBody({ name, email, password }: RequestBody): string {
    const nameValidationMessage = getValidationMessageForName(name)
    if (nameValidationMessage) {
      return nameValidationMessage
    }
    const emailValidationMessage = getValidationMessageForEmail(email)
    if (emailValidationMessage) {
      return emailValidationMessage
    }
    const passwordValidationMessage = getValidationMessageForPassword(password)
    if (passwordValidationMessage) {
      return passwordValidationMessage
    }
    return null
  }

  public async execute(request: Request): Promise<Response> {
    if (!request.body) {
      return { status: 400, body: "Missing the request body" }
    }
    const validationMessage = this.validateBody(request.body)
    if (validationMessage) {
      return { status: 400, body: validationMessage }
    }
    try {
      await this.init()
      const response = await this.createUserController.execute(request)
      return response
    } catch (err) {
      return { status: 500, body: "Error to create an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
