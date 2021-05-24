import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/users.data-access"
import GeneratePasswordHashService from "../../../server/services/users/implementations/generate-password-hash.service"
import CreateUserService from "../../../server/services/users/implementations/create.service"
import FindUserByEmailService from "../../../server/services/users/implementations/find-by-email.service"
import {
  getValidationMessageForEmail,
  getValidationMessageForPassword
} from "../../../server/validators/users.validator"
import DeleteUserByEmailService from "../../../server/services/users/implementations/delete-by-email.service"
import UserNotFoundByEmailError from "../../../server/errors/users/user-not-found-by-email.error"
import PasswordIsNotAMatchError from "../../../server/errors/users/password-is-not-a-match.error"
import { SignInDataType } from "../../../server/types/users.types"

import FakeUserService from "../../fakes/services/user.fake"
import UsersApiCaller from "../../utils/users/api-caller.util"
import { ApiCallerError, ApiCallerResponse } from "../../utils/types/api-caller.types"

// BDD02
describe("[BDD] Sign In", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 21
  test("Scenario 1 - valid credentiasl", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("BDD021")
    const passwordHash = await generatePasswordHashService.execute(password)
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(createdUser).not.toBeNull()
    // When
    let response: ApiCallerResponse<SignInDataType> = undefined
    let requestErr: ApiCallerError = undefined
    try {
      response = await UsersApiCaller.signinUser({ email, password })
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
    expect(response.body.user.name).toBe(createdUser.name)
    expect(response.body.user.email).toBeDefined()
    expect(response.body.user.email).toBe(createdUser.email)
    expect(response.body.token).toBeDefined()
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })

  // 22
  test("Scenario 2 - invalid e-mail (value validation)", async () => {
    // Setup
    const { password } = FakeUserService.getNew("BDD022")
    const email = ""
    const emailValidationMessage = getValidationMessageForEmail(email)
    // Given
    expect(emailValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await UsersApiCaller.signinUser({ email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).not.toBeNull()
    expect(requestErr.body).toBe(emailValidationMessage)
  })

  // 23
  test("Scenario 3 - invalid password (value validation)", async () => {
    // Setup
    const { email } = FakeUserService.getNew("BDD023")
    const password = ""
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(passwordValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await UsersApiCaller.signinUser({ email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(passwordValidationMessage)
  })

  // 24
  test("Scenario 4 - e-mail is not registered", async () => {
    // Setup
    const { email, password } = FakeUserService.getNew("BDD024")
    const registeredUser = await findUserByEmailService.execute(email)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await UsersApiCaller.signinUser({ email, password })
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

  // 25
  test("Scenario 5 - password is not a match", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("BDD025A")
    const { password: otherPassword } = FakeUserService.getNew("BDD025B")
    await createUserService.execute({ name, email, password })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(otherPassword)
    const foundUser = await findUserByEmailService.execute(email)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(foundUser).not.toBeNull()
    // Then
    let requestErr: ApiCallerError = undefined
    try {
      await UsersApiCaller.signinUser({ email, password: otherPassword })
    } catch (err) {
      requestErr = err
    }
    // When
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(PasswordIsNotAMatchError.message)
  })
})
