import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ICreateTaskController from "../../controllers/tasks/create.interface"

import { CreateTaskType } from "../../types/tasks.types"

import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import CreateTaskController from "../../controllers/tasks/implementations/create.controller"
import CreateTaskUseCase from "../../use-cases/tasks/implementations/create.use-case"
import TaskValidator from "../../validators/tasks.validator"
import FindUserByIdService from "../../services/users/implementations/find-by-id.service"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import CreateTaskService from "../../services/tasks/implementations/create.service"
import TaskDataAccess from "../../data-access/implementations/tasks.data-access"

import UnauthenticatedRequestError from "../../errors/request/unauthenticated-request.error"
import MissingRequestBodyError from "../../errors/request/missing-request-body.error"
import MissingRequestParamsError from "../../errors/request/missing-request-params.error"
import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ExpiredTokenError from "../../errors/users/expired-token.error"
import InvalidTokenError from "../../errors/users/invalid-token.error"
import UserValidator from "../../validators/users.validator"
import TokenWithInvalidUserIdError from "../../errors/users/token-with-invalid-user-id.error"
import InvalidRequestParamsError from "../../errors/request/invalid-request-params.error"
import UserIdFromRequestTokenAndParamsAreNotMatchError from "../../errors/request/user-id-from-request-token-and-params-are-not-match.error"

export default class CreateUserWrapper implements IControllerWrapper<CreateTaskType, void> {
  private connection: Connection
  private createTaskController: ICreateTaskController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const taskDataAccess = new TaskDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const createTaskService = new CreateTaskService(taskDataAccess)
    const createTaskUseCase = new CreateTaskUseCase(findUserByIdService, createTaskService)
    this.createTaskController = new CreateTaskController(createTaskUseCase)
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  private validateBody({ name, description }: Partial<CreateTaskType>): string {
    const nameValidationMessage = TaskValidator.getMessageForName(name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
    }
    const descriptionValidationMessage = TaskValidator.getMessageForDescription(description)
    if (descriptionValidationMessage !== null) {
      return descriptionValidationMessage
    }
    return null
  }

  public async execute(request: WrapperRequest<CreateTaskType>): Promise<WrapperResponse<void>> {
    const { headers, body, params } = request
    // TODO: Create RequestValidator.getResponseForUserIdParam(params)
    if (params === undefined || params.userId === undefined) {
      return { status: 400, body: MissingRequestParamsError.message }
    }
    const paramsValidationMessage = UserValidator.getMessageForUserId(params.userId)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: InvalidRequestParamsError.message }
    }
    // TODO: Create RequestValidator.getResponseForAuthenticationHeaders(headers)
    if (headers === undefined || headers.authentication_token === undefined) {
      return { status: 401, body: UnauthenticatedRequestError.message }
    }
    try {
      const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
      const decodedToken = authenticationTokenDecoderService.execute(headers.authentication_token)
      const tokenValidationMessage = UserValidator.getMessageForUserId(decodedToken.userId)
      if (tokenValidationMessage !== null) {
        return { status: 400, body: TokenWithInvalidUserIdError.message }
      }
      if (params.userId !== decodedToken.userId) {
        return { status: 400, body: UserIdFromRequestTokenAndParamsAreNotMatchError.message }
      }
    } catch (err) {
      if (err instanceof ExpiredTokenError || err instanceof InvalidTokenError) {
        return { status: 400, body: err.message }
      }
      return { status: 500, body: err.message }
    }
    // TODO: Create RequestValidator.getResponseForBody(body, validatorCallback)
    if (body === undefined) {
      return { status: 400, body: MissingRequestBodyError.message }
    }
    const validationMessage = this.validateBody(request.body)
    if (validationMessage !== null) {
      return { status: 400, body: validationMessage }
    }
    try {
      await this.init()
      const response = await this.createTaskController.execute({ headers, body, params })
      return response
    } catch (err) {
      return { status: 500, body: "Error to create an user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
