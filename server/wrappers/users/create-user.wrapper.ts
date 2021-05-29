import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ICreateUserController from "../../controllers/users/create-user-controller.interface"

import CreateUserController from "../../controllers/users/implementations/create-user.controller"
import UserDataAccess from "../../data-access/implementations/user.data-access"
import CreateUserService from "../../services/users/implementations/create-user.service"
import FindUserByEmailService from "../../services/users/implementations/find-user-by-email.service"
import GeneratePasswordHashService from "../../services/users/implementations/generate-password-hash.service"
import CreateUserUseCase from "../../use-cases/users/implementations/create-user.use-case"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import UserValidator from "../../validators/user.validator"
import { CreateUserType } from "../../types/user.types"
import RequestValidator from "../../validators/request.validator"

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
    const bodyValidationResponse = RequestValidator.getResponseForExistingBody(
      body,
      this.validateBody
    )
    if (bodyValidationResponse !== null) {
      return bodyValidationResponse
    }
    try {
      await this.init()
      const response = await this.createUserController.execute({ body })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to create an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
