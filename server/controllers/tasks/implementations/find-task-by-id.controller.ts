import IAuthenticationTokenDecoderService from "../../../services/users/authentication-token-decoder-service.interface"
import IFindTaskByIdController, {
  FindTaskByIdRequestType,
  FindTaskByIdResponseType
} from "../find-task-by-id-controller.interface"
import IFindTaskByIdUseCase from "../../../use-cases/tasks/find-task-by-id-use-case.interface"

import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class FindTaskByIdController implements IFindTaskByIdController {
  private readonly authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private readonly findTaskByIdUseCase: IFindTaskByIdUseCase

  constructor(
    authenticationTokenDecoderService: IAuthenticationTokenDecoderService,
    findTaskByIdUseCase: IFindTaskByIdUseCase
  ) {
    this.authenticationTokenDecoderService = authenticationTokenDecoderService
    this.findTaskByIdUseCase = findTaskByIdUseCase
  }

  public async execute(request: FindTaskByIdRequestType): Promise<FindTaskByIdResponseType> {
    const { taskId } = request.params
    const token = request.headers.authentication_token
    const { userId } = this.authenticationTokenDecoderService.execute(token)
    try {
      const foundTask = await this.findTaskByIdUseCase.execute(userId, taskId)
      return { status: 200, body: foundTask }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: UserNotFoundByIdError.message }
      }
      if (err instanceof TaskNotFoundByIdError) {
        return { status: 400, body: TaskNotFoundByIdError.message }
      }
      throw err
    }
  }
}
