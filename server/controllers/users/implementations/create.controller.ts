import ICreateUserController, { Request, Response } from "../create.interface"
import ICreateUserUseCase from "../../../use-cases/users/create.interface"
import { EmailAlreadyInUseError } from "../../../errors/users/email-already-in-use.error"

export default class CreateUserController implements ICreateUserController {
  private readonly createUserUseCase: ICreateUserUseCase

  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  public async execute(request: Request): Promise<Response> {
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
