import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder-service.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import IFindTasksByUserIdController from "../../controllers/tasks/find-tasks-by-user-id-controller.interface"

import { TaskType } from "../../types/task.types"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import FindTasksByUserIdController from "../../controllers/tasks/implementations/find-tasks-by-user-id.controller"
import RequestValidator from "../../validators/request.validator"
import FindTasksByUserIdUseCase from "../../use-cases/tasks/implementations/find-tasks-by-user-id.use-case"
import FindUserByIdService from "../../services/users/implementations/find-user-by-id.service"
import FindTasksByUserIdService from "../../services/tasks/implementations/find-tasks-by-user-id.service"
import UserDataAccess from "../../data-access/implementations/user.data-access"
import TaskDataAccess from "../../data-access/implementations/task.data-access"

export default class FindTasksByUserIdWrapper implements IControllerWrapper<void, TaskType[]> {
  private connection: Connection
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private findTasksByUserIdController: IFindTasksByUserIdController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const userDataAccess = new UserDataAccess(this.connection)
    const taskDataAccess = new TaskDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const findTasksByUserIdService = new FindTasksByUserIdService(taskDataAccess)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCase(findUserByIdService, findTasksByUserIdService)
    this.findTasksByUserIdController = new FindTasksByUserIdController(findTasksByUserIdUseCase)
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<TaskType[]>> {
    const { headers, params } = request
    const paramsValidationResponse = RequestValidator.getResponseForParamsWithUserId(params)
    if (paramsValidationResponse !== null) {
      return paramsValidationResponse
    }
    try {
      await this.init()
      const headersValidationResponse = RequestValidator.getResponseForAuthenticationHeaders(
        headers,
        this.authenticationTokenDecoderService,
        params.userId
      )
      if (headersValidationResponse !== null) {
        return headersValidationResponse
      }
      const response = await this.findTasksByUserIdController.execute({ headers, params })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to find tasks by user id: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
