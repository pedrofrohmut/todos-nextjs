import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder-service.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import IFindTaskByIdController from "../../controllers/tasks/find-task-by-id-controller.interface"

import { TaskType } from "../../types/task.types"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import FindTaskByIdController from "../../controllers/tasks/implementations/find-task-by-id.controller"
import FindTaskByIdService from "../../services/tasks/implementations/find-task-by-id.service"
import FindTaskByIdUseCase from "../../use-cases/tasks/implementations/find-task-by-id.use-case"
import FindUserByIdService from "../../services/users/implementations/find-user-by-id.service"
import RequestValidator from "../../validators/request.validator"
import TaskDataAccess from "../../data-access/implementations/task.data-access"
import UserDataAccess from "../../data-access/implementations/user.data-access"

export default class FindTaskByIdWrapper implements IControllerWrapper<void, TaskType> {
  private connection: Connection
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private findTaskByIdController: IFindTaskByIdController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const userDataAccess = new UserDataAccess(this.connection)
    const taskDataAccess = new TaskDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const findTaskByIdService = new FindTaskByIdService(taskDataAccess)
    const findTaskByIdUseCase = new FindTaskByIdUseCase(findUserByIdService, findTaskByIdService)
    this.findTaskByIdController = new FindTaskByIdController(
      this.authenticationTokenDecoderService,
      findTaskByIdUseCase
    )
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<TaskType>> {
    const { headers, params } = request
    const paramsValidationResponse = RequestValidator.getResponseForParamsWithTaskId(params)
    if (paramsValidationResponse !== null) {
      return paramsValidationResponse
    }
    try {
      await this.init()
      const headersValidationResponse = RequestValidator.getResponseForAuthenticationHeaders(
        headers,
        this.authenticationTokenDecoderService
      )
      if (headersValidationResponse !== null) {
        return headersValidationResponse
      }
      const response = await this.findTaskByIdController.execute({ headers, params })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to find task by id: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
