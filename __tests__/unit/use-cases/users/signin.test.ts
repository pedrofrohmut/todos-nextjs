import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import PasswordIsNotAMatchError from "../../../../server/errors/users/password-is-not-a-match.error"
import UserNotFoundByEmailError from "../../../../server/errors/users/user-not-found-by-email.error"
import CheckPasswordService from "../../../../server/services/users/implementations/check-password.service"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"
import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import {SignInDataType} from "../../../../server/types/users.types"
import SignInUseCase from "../../../../server/use-cases/users/implementations/signin.use-case"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import {getValidationMessageForEmail, getValidationMessageForPassword} from "../../../../server/validators/users.validator"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 18
// 1 - Sign with a e-mail that is not registered return 400 and a message
// 2 - Sign with a password that does not match the hash from db returns 400 and a message
// 3 - Sign with registered user and valid credentials returns 200 and SignInData
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
  const generatePasswordHashService = new GeneratePasswordHashService()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("E-mail not registered", async () => {
    // Setup
    const { email, password } = FakeUserService.getNew("181")
    const foundUser = await userDataAccess.findByEmail(email)
    // Given
    expect(foundUser).toBeNull()
    // When
    let useCaseErr: Error = undefined
    try {
      await signInUseCase.execute({ email, password })
    } catch (err) {
      useCaseErr = err
    }
    // Evaluation
    expect(useCaseErr).toBeDefined()
    expect(useCaseErr instanceof UserNotFoundByEmailError).toBe(true)
    expect(useCaseErr.message).toBe(UserNotFoundByEmailError.message)
  })

  // 2
  test("Password is not match", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("182A")
    const { password: otherPassword } = FakeUserService.getNew("182B")
    const passwordHash = await generatePasswordHashService.execute(password)
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(otherPassword)
    const isMatch = await checkPasswordService.execute(otherPassword, passwordHash)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(createdUser).not.toBeNull()
    expect(createdUser.passwordHash).toBeDefined()
    expect(isMatch).not.toBe(true)
    // When
    let useCaseErr: Error = undefined
    try {
      await signInUseCase.execute({ email, password: otherPassword })
    } catch (err) {
      useCaseErr = err
    }
    // Then
    expect(useCaseErr).toBeDefined()
    expect(useCaseErr instanceof PasswordIsNotAMatchError).toBeDefined()
    expect(useCaseErr.message).toBe(PasswordIsNotAMatchError.message)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 3
  test("Valid credentials", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("183")
    const passwordHash = await generatePasswordHashService.execute(password)
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(createdUser).not.toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    // When
    let useCaseErr : Error = undefined
    let signInData: SignInDataType = undefined
    try {
      signInData = await signInUseCase.execute({ email, password })
    } catch (err) {
      useCaseErr = err
    }
    // Evaluation
    expect(useCaseErr).not.toBeDefined()
    expect(signInData).toBeDefined()
    expect(signInData.user).toBeDefined()
    expect(signInData.user.id).toBeDefined()
    expect(signInData.user.id).toBe(createdUser.id)
    expect(signInData.user.name).toBeDefined()
    expect(signInData.user.name).toBe(name)
    expect(signInData.user.email).toBeDefined()
    expect(signInData.user.email).toBe(email)
    expect(signInData.token).toBeDefined()
    // Clean Up 
    await userDataAccess.deleteByEmail(email)
  })
})
