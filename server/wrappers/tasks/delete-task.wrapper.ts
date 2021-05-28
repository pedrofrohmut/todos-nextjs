import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import IDeleteTaskController from "../../controllers/tasks/delete-task-controller.interface"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, {Connection} from "../../utils/connection-factory.util"
import DeleteTaskController from "../../controllers/tasks/implementations/delete-task.controller"
import RequestValidator from "../../validators/request.validator"

export default class DeleteTaskWrapper implements IControllerWrapper<void, void> {
  private connection: Connection
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private deleteTaskController: IDeleteTaskController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    this.deleteTaskController = new DeleteTaskController()
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  private validateBody(): string {}

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<void>> {
    const { headers, params } = request
    const paramsValidationResponse = RequestValidator.getResponseForParamsWithUserId(params)
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
      return { status: 500, body: "Error to delete a task: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
