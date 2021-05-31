import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder-service.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import IDeleteTaskController from "../../controllers/tasks/delete-task-controller.interface"

import { Connection } from "../../types/connection.types"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory from "../../utils/connection-factory.util"
import DeleteTaskByIdService from "../../services/tasks/implementations/delete-task-by-id.service"
import DeleteTaskController from "../../controllers/tasks/implementations/delete-task.controller"
import DeleteTaskUseCase from "../../use-cases/tasks/implementations/delete-task.use-case"
import FindTaskByIdService from "../../services/tasks/implementations/find-task-by-id.service"
import FindUserByIdService from "../../services/users/implementations/find-user-by-id.service"
import RequestValidator from "../../validators/request.validator"
import TaskDataAccess from "../../data-access/implementations/task.data-access"
import UserDataAccess from "../../data-access/implementations/user.data-access"

export default class DeleteTaskWrapper implements IControllerWrapper<void, void> {
  private connection: Connection
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private deleteTaskController: IDeleteTaskController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const userDataAccess = new UserDataAccess(this.connection)
    const taskDataAccess = new TaskDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const findTaskByIdService = new FindTaskByIdService(taskDataAccess)
    const deleteTaskByIdService = new DeleteTaskByIdService(taskDataAccess)
    const deleteTaskUseCase = new DeleteTaskUseCase(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskByIdService
    )
    this.deleteTaskController = new DeleteTaskController(
      this.authenticationTokenDecoderService,
      deleteTaskUseCase
    )
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<void>> {
    const { headers, params } = request
    const paramsValidationResponse = RequestValidator.getResponseForParamsWithTaskId(params)
    if (paramsValidationResponse !== null) {
      return paramsValidationResponse
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
      const response = await this.deleteTaskController.execute({ headers, params })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to delete a task: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
