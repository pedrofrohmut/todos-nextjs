import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ISignInController from "../../controllers/users/signin-controller.interface"

import { Connection } from "../../types/connection.types"
import { SignInCredentialsType, SignInDataType } from "../../types/user.types"

import CheckPasswordService from "../../services/users/implementations/check-password.service"
import ConnectionFactory from "../../utils/connection-factory.util"
import FindUserByEmailService from "../../services/users/implementations/find-user-by-email.service"
import GenerateAuthenticationTokenService from "../../services/users/implementations/generate-authentication-token.service"
import RequestValidator from "../../validators/request.validator"
import SignInController from "../../controllers/users/implementations/signin.controller"
import SignInUseCase from "../../use-cases/users/implementations/signin.use-case"
import UserDataAccess from "../../data-access/implementations/user.data-access"
import UserValidator from "../../validators/user.validator"

export default class SignInWrapper
  implements IControllerWrapper<SignInCredentialsType, SignInDataType> {
  private connection: Connection
  private signinController: ISignInController

  constructor() {}

  private validateBody({ email, password }: Partial<SignInCredentialsType>): string {
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

  public async execute(
    request: WrapperRequest<SignInCredentialsType>
  ): Promise<WrapperResponse<SignInDataType>> {
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
      const response = await this.signinController.execute({ body })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to sign in an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
