import ICreateUserController, {
  CreateUserRequestType,
  CreateUserResponseType
} from "../create-user-controller.interface"
import ICreateUserUseCase from "../../../use-cases/users/create-user-use-case.interface"

import EmailAlreadyInUseError from "../../../errors/users/email-already-in-use.error"

export default class CreateUserController implements ICreateUserController {
  private readonly createUserUseCase: ICreateUserUseCase

  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  public async execute(request: CreateUserRequestType): Promise<CreateUserResponseType> {
    const { name, email, password } = request.body
    try {
      await this.createUserUseCase.execute({ name, email, password })
      return { status: 201 }
    } catch (err) {
      if (err instanceof EmailAlreadyInUseError) {
        return { status: 400, body: EmailAlreadyInUseError.message }
      }
      throw err
    }
  }
}
