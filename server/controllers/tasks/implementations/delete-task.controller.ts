import IAuthenticationTokenDecoderService from "../../../services/users/authentication-token-decoder.interface"
import IDeleteTaskController, {
  DeleteTaskRequestType,
  DeleteTaskResponseType
} from "../delete-task-controller.interface"
import IDeleteTaskUseCase from "../../../use-cases/tasks/delete-task-use-case.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class DeleteTaskController implements IDeleteTaskController {
  private readonly authenticationTokenDecoderService: IAuthenticationTokenDecoderService
  private readonly deleteTaskUseCase: IDeleteTaskUseCase

  constructor(
    authenticationTokenDecoderService: IAuthenticationTokenDecoderService,
    deleteTaskUseCase: IDeleteTaskUseCase
  ) {
    this.authenticationTokenDecoderService = authenticationTokenDecoderService
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  public async execute(request: DeleteTaskRequestType): Promise<DeleteTaskResponseType> {
    const { taskId } = request.params
    const token = request.headers.authentication_token
    const { userId } = this.authenticationTokenDecoderService.execute(token)
    try {
      await this.deleteTaskUseCase.execute(userId, taskId)
      return { status: 204 }
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
