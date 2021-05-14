import ICreateUserController, { Request, RequestBody, Response } from "./interface"
import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../../validation/users"
import ConnectionFactory, { Connection } from "../../../utils/connection-factory"
import UserDataAccess from "../../../data-access/users/implementation"
import FindUserByEmailService from "../../../services/users/find-by-email/implementation"
import CreateUserService from "../../../services/users/create/implementation"
import GeneratePasswordHashService from "../../../services/users/generate-password-hash/implementation"
import ICreateUserUseCase from "../../../use-cases/users/create/interface"
import CreateUserUseCase from "../../../use-cases/users/create/implementation"
import { EmailAlreadyInUseError } from "../../../errors/users/email-already-in-use"

export default class CreateUserController implements ICreateUserController {
  private connection: Connection
  private createUserUseCase: ICreateUserUseCase

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByEmailService = new FindUserByEmailService(userDataAccess)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    this.createUserUseCase = new CreateUserUseCase(findUserByEmailService, createUserService)
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
    const { name, email, password } = request.body
    try {
      await this.init()
      await this.createUserUseCase.execute({ name, email, password })
      return {
        status: 201
      }
    } catch (err) {
      if (err instanceof EmailAlreadyInUseError) {
        return { status: 400, body: EmailAlreadyInUseError.message }
      }
      return { status: 500, body: "Error to create an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
