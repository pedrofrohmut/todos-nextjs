import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import { PasswordIsNotAMatchError } from "../../../../server/errors/users/password-is-not-a-match.error"
import { UserNotFoundByEmailError } from "../../../../server/errors/users/user-not-found-by-email.error"
import CheckPasswordService from "../../../../server/services/users/implementations/check-password.service"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"
import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import SignInUseCase from "../../../../server/use-cases/users/implementations/signin.use-case"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"

// Case 18
describe("[Use Case] Sign in Use Case", () => {
  // Dependencies
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const checkPasswordService = new CheckPasswordService()
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()
  const signInUseCase = new SignInUseCase(
    findUserByEmailService,
    checkPasswordService,
    generateAuthenticationTokenService
  )
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("Sign in with a e-mail not registered to throw error", async () => {
    // Setup
    const password = "password181"
    const email = "john_doe181@mail.com"
    await deleteUserByEmailService.execute(email)
    try {
      // Test
      await signInUseCase.execute({ email, password })
    } catch (err) {
      // Evaluation
      expect(err).toBeDefined()
      expect(err instanceof UserNotFoundByEmailError).toBe(true)
    }
  })

  // 2
  test("Sign in with a valid password that doesnt match throw error", async () => {
    // Setup
    const email = "john_doe182@mail.com"
    const password = "password182"
    const differentPassword = "different_password182"
    await createUserService.execute({ name: "John Doe 182", email, password })
    try {
      // Test
      await signInUseCase.execute({ email, password: differentPassword })
    } catch (err) {
      // Evaluation
      expect(err).toBeDefined()
      expect(err instanceof PasswordIsNotAMatchError).toBe(true)
    }
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })

  // 3
  test("Sign in with valid credentials to return user data and authentication token", async () => {
    // Setup
    const name = "John Doe 183"
    const email = "john_doe183@mail.com"
    const password = "password183"
    await createUserService.execute({ name, email, password })
    // Test
    const signInData = await signInUseCase.execute({ email, password })
    // Evaluation
    expect(signInData).toBeDefined()
    expect(signInData.user).toBeDefined()
    expect(signInData.token).toBeDefined()
    expect(signInData.user.name).toBe(name)
    expect(signInData.user.email).toBe(email)
  })
})
