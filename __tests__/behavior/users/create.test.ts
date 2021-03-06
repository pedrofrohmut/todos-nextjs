import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/user.data-access"
import FindUserByEmailService from "../../../server/services/users/implementations/find-user-by-email.service"
import UserValidator from "../../../server/validators/user.validator"
import CreateUserService from "../../../server/services/users/implementations/create-user.service"
import GeneratePasswordHashService from "../../../server/services/users/implementations/generate-password-hash.service"
import EmailAlreadyInUseError from "../../../server/errors/users/email-already-in-use.error"

import UsersApiCaller from "../../../view/api/users.api"
import { ApiError, ApiResponse } from "../../../view/api/api.types"
import FakeUserService from "../../fakes/services/user.fake"

// BDD01
describe("[BDD] Create users", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 11
  test("Scenario 1 - valid credentials", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("BDD011")
    const nameValidationMessage = UserValidator.getMessageForName(name)
    const emailValidationMessage = UserValidator.getMessageForEmail(email)
    const passwordValidationMessage = UserValidator.getMessageForPassword(password)
    const foundUserByEmail = await userDataAccess.findByEmail(email)
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(foundUserByEmail).toBeNull()
    // When
    let response: ApiResponse<void> = undefined
    let requestErr: ApiError = undefined
    try {
      response = await UsersApiCaller.createUser({ name, email, password })
    } catch (err) {
      requestErr = err
    }
    // Setup 2
    const createdUser = await userDataAccess.findByEmail(email)
    // Then
    expect(requestErr).not.toBeDefined()
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).toBe(201)
    expect(response.body).not.toBeDefined()
    expect(createdUser).not.toBeNull()
  })

  // 12
  test("Scenario 2 - invalid name (value validation)", async () => {
    // Setup
    const { email, password } = FakeUserService.getNew("BDD012")
    const name = ""
    const nameValidationMessage = UserValidator.getMessageForName(name)
    // Given
    expect(nameValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.createUser({ name, email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(nameValidationMessage)
  })

  // 13
  test("Scenario 3 - invalid email (value validation)", async () => {
    // Setup
    const { name, password } = FakeUserService.getNew("BDD013")
    const email = ""
    const emailValidationMessage = UserValidator.getMessageForEmail(email)
    // Given
    expect(emailValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.createUser({ name, email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(emailValidationMessage)
  })

  // 14
  test("Scenario 4 - invalid password (value validation)", async () => {
    // Setup
    const { name, email } = FakeUserService.getNew("BDD014")
    const password = ""
    const passwordValidationMessage = UserValidator.getMessageForPassword(password)
    // Given
    expect(passwordValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.createUser({ name, email, password })
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

  // 15
  test("Scenario 5 - E-mail is already in registered", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("BDD015A")
    const { name: otherName, password: otherPassword } = FakeUserService.getNew("BDD015B")
    const nameValidationMessage = UserValidator.getMessageForName(otherName)
    const emailValidationMessage = UserValidator.getMessageForEmail(email)
    const passwordValidationMessage = UserValidator.getMessageForPassword(otherPassword)
    await createUserService.execute({ name, email, password })
    const registeredUser = await findUserByEmailService.execute(email)
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).not.toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.createUser({ name: otherName, email, password: otherPassword })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(EmailAlreadyInUseError.message)
  })
})
