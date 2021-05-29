import ISignInController, { SignInRequestType, SignInResponseType } from "../signin-controller.interface"
import ISignInUseCase from "../../../use-cases/users/signin-use-case.interface"

import PasswordIsNotAMatchError from "../../../errors/users/password-is-not-a-match.error"
import UserNotFoundByEmailError from "../../../errors/users/user-not-found-by-email.error"

export default class SignInController implements ISignInController {
  private readonly signInUseCase: ISignInUseCase

  constructor(signInUseCase: ISignInUseCase) {
    this.signInUseCase = signInUseCase
  }

  public async execute(request: SignInRequestType): Promise<SignInResponseType> {
    const { email, password } = request.body
    try {
      const signInData = await this.signInUseCase.execute({ email, password })
      return { status: 200, body: signInData }
    } catch (err) {
      if (err instanceof UserNotFoundByEmailError) {
        return { status: 400, body: UserNotFoundByEmailError.message }
      }
      if (err instanceof PasswordIsNotAMatchError) {
        return { status: 400, body: PasswordIsNotAMatchError.message }
      }
      throw err
    }
  }
}
