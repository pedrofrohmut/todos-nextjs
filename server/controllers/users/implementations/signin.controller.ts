import ISignInController, { Request, RequestBody, Response } from "../signin.interface"
import ConnectionFactory, { Connection } from "../../../utils/connection-factory.util"
import {
  getValidationMessageForEmail,
  getValidationMessageForPassword
} from "../../../validators/users.validator"
import UserDataAccess from "../../../data-access/implementations/users.data-access"
import FindUserByEmailService from "../../../services/users/implementations/find-by-email.service"
import CheckPasswordService from "../../../services/users/implementations/check-password.service"
import GenerateAuthenticationTokenService from "../../../services/users/implementations/generate-authentication-token.service"
import ISignInUseCase from "../../../use-cases/users/signin.interface"
import SignInUseCase from "../../../use-cases/users/implementations/signin.use-case"
import { UserNotFoundByEmailError } from "../../../errors/users/user-not-found-by-email.error"
import { PasswordIsNotAMatchError } from "../../../errors/users/password-is-not-a-match.error"

export default class SignInController implements ISignInController {
  private connection: Connection
  private signInUseCase: ISignInUseCase

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
    this.signInUseCase = new SignInUseCase(
      findUserByEmailService,
      checkPasswordService,
      generateAuthenticationTokenService
    )
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: Request): Promise<Response> {
    if (!request.body) {
      return { status: 400, body: "Missing the request body" }
    }
    const validationMessage = this.validateBody(request.body)
    if (validationMessage) {
      return { status: 400, body: validationMessage }
    }
    const { email, password } = request.body
    try {
      await this.init()
      const signInData = await this.signInUseCase.execute({ email, password })
      return { status: 200, body: signInData }
    } catch (err) {
      if (err instanceof UserNotFoundByEmailError) {
        return { status: 400, body: UserNotFoundByEmailError.message }
      }
      if (err instanceof PasswordIsNotAMatchError) {
        return { status: 400, body: PasswordIsNotAMatchError.message }
      }
      return { status: 500, body: "Error to sign in an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
