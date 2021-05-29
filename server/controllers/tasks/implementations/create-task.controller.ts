import ICreateTaskController, {
  CreateTaskRequestType,
  CreateTaskResponseType
} from "../create-task-controller.interface"
import ICreateTaskUseCase from "../../../use-cases/tasks/create-task-use-case.interface"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreateTaskController implements ICreateTaskController {
  private readonly createTaskUseCase: ICreateTaskUseCase

  constructor(createTaskUseCase: ICreateTaskUseCase) {
    this.createTaskUseCase = createTaskUseCase
  }

  public async execute(request: CreateTaskRequestType): Promise<CreateTaskResponseType> {
    const { name, description } = request.body
    const { userId } = request.params
    try {
      await this.createTaskUseCase.execute({ name, description, userId })
      return { status: 201 }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: UserNotFoundByIdError.message }
      }
      throw err
    }
  }
}
