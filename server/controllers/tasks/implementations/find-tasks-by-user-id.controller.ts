import IFindTasksByUserIdController, {
  FindTasksByUserIdRequestType,
  FindTasksByUserIdResponseType
} from "../find-tasks-by-user-id-controller.interface"
import IFindTasksByUserIdUseCase from "../../../use-cases/tasks/find-tasks-by-user-id-use-case.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class FindTasksByUserIdController implements IFindTasksByUserIdController {
  private readonly findTasksByUserIdUseCase: IFindTasksByUserIdUseCase

  constructor(findTasksByUserIdUseCase: IFindTasksByUserIdUseCase) {
    this.findTasksByUserIdUseCase = findTasksByUserIdUseCase
  }

  public async execute(
    request: FindTasksByUserIdRequestType
  ): Promise<FindTasksByUserIdResponseType> {
    const { userId } = request.params
    try {
      const tasks = await this.findTasksByUserIdUseCase.execute(userId)
      return { status: 200, body: tasks }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: UserNotFoundByIdError.message }
      }
      throw err
    }
  }
}
