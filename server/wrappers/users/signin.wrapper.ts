import IControllerWrapper from "../controller-wrapper.interface"
import SignInController from "../../controllers/users/implementations/signin.controller"
import ISignInController, {
  Request,
  RequestBody,
  Response
} from "../../controllers/users/signin.interface"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import CheckPasswordService from "../../services/users/implementations/check-password.service"
import FindUserByEmailService from "../../services/users/implementations/find-by-email.service"
import GenerateAuthenticationTokenService from "../../services/users/implementations/generate-authentication-token.service"
import SignInUseCase from "../../use-cases/users/implementations/signin.use-case"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import {
  getValidationMessageForEmail,
  getValidationMessageForPassword
} from "../../validators/users.validator"

export default class SignInWrapper implements IControllerWrapper {
  private connection: Connection
  private signinController: ISignInController

  constructor() {}

  private validateBody({ email, password }: RequestBody): string {
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

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByEmailService = new FindUserByEmailService(userDataAccess)
    const checkPasswordService = new CheckPasswordService()
    const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()
    const signInUseCase = new SignInUseCase(
      findUserByEmailService,
      checkPasswordService,
      generateAuthenticationTokenService
    )
    this.signinController = new SignInController(signInUseCase)
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: Request): Promise<Response> {
    // TODO: use a filter for BodyIsDefined
    if (!request.body) {
      return { status: 400, body: "Missing the request body" }
    }
    const validationMessage = this.validateBody(request.body)
    if (validationMessage) {
      return { status: 400, body: validationMessage }
    }
    try {
      await this.init()
      const response = await this.signinController.execute(request)
      return response
    } catch (err) {
      return { status: 500, body: "Error to sign in an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
