import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import ApiCaller, { ApiCallerError, ApiCallerResponse } from "../../../utils/api-caller.util"
import UserNotFoundByEmailError from "../../../../server/errors/users/user-not-found-by-email.error"
import FakeUserService from "../../../fakes/services/user.fake"
import {
  getValidationMessageForEmail,
  getValidationMessageForPassword
} from "../../../../server/validators/users.validator"
import PasswordIsNotAMatchError from "../../../../server/errors/users/password-is-not-a-match.error"
import CheckPasswordService from "../../../../server/services/users/implementations/check-password.service"
import { SignInDataType } from "../../../../server/types/users.types"

// Case 17
// 1 - User not registered return 400 and message
// 2 - Password is not match return 400 and message
// 3 - Valid credentials return 200 and SignInData
describe("[Controller] SignIn User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const checkPasswordService = new CheckPasswordService()

  beforeAll(async () => {
    ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("User not registered", async () => {
    // Setup.
    const { email, password } = FakeUserService.getNew("171")
    const foundUser = await userDataAccess.findByEmail(email)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(foundUser).toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.signinUser({ email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(UserNotFoundByEmailError.message)
  })

  // 2
  test("Password is not match", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("172A")
    const { password: otherPassword } = FakeUserService.getNew("172B")
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
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.signinUser({ email, password: otherPassword })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(PasswordIsNotAMatchError.message)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 3
  test("Valid credentials", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("173")
    await createUserService.execute({ name, email, password })
    const createdUser = await userDataAccess.findByEmail(email)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(createdUser).not.toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    let response: ApiCallerResponse<SignInDataType> = undefined
    try {
      response = await ApiCaller.signinUser({ email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).not.toBeDefined()
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.user).toBeDefined()
    expect(response.body.user.id).toBeDefined()
    expect(response.body.user.id).toBe(createdUser.id)
    expect(response.body.user.name).toBeDefined()
    expect(response.body.user.name).toBe(name)
    expect(response.body.user.email).toBeDefined()
    expect(response.body.user.email).toBe(email)
    expect(response.body.token).toBeDefined()
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })
})
