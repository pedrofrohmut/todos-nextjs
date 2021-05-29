import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder-service.interface"
import ICreateTaskController from "../../controllers/tasks/create-task-controller.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"

import { CreateTaskType } from "../../types/task.types"

import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import CreateTaskController from "../../controllers/tasks/implementations/create-task.controller"
import CreateTaskService from "../../services/tasks/implementations/create-task.service"
import CreateTaskUseCase from "../../use-cases/tasks/implementations/create-task.use-case"
import FindUserByIdService from "../../services/users/implementations/find-user-by-id.service"
import RequestValidator from "../../validators/request.validator"
import TaskDataAccess from "../../data-access/implementations/task.data-access"
import TaskValidator from "../../validators/task.validator"
import UserDataAccess from "../../data-access/implementations/user.data-access"
import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"

export default class CreateUserWrapper implements IControllerWrapper<CreateTaskType, void> {
  private connection: Connection
  private createTaskController: ICreateTaskController
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService

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
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
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
    const paramsValidationResponse = RequestValidator.getResponseForParamsWithUserId(params)
    if (paramsValidationResponse !== null) {
      return paramsValidationResponse
    }
    const bodyValidationResponse = RequestValidator.getResponseForExistingBody(
      body,
      this.validateBody
    )
    if (bodyValidationResponse !== null) {
      return bodyValidationResponse
    }
    try {
      await this.init()
      const headersValidationResponse = RequestValidator.getResponseForAuthenticationHeaders(
        request.headers,
        this.authenticationTokenDecoderService,
        params.userId
      )
      if (headersValidationResponse !== null) {
        return headersValidationResponse
      }
      const response = await this.createTaskController.execute({ headers, body, params })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to create an task: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
