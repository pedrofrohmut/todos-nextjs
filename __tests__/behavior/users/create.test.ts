import { SERVER_URL } from "../../constants"
import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/users.data-access"
import FindUserByEmailService from "../../../server/services/users/implementations/find-by-email.service"
import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../../server/validators/users.validator"
import CreateUserService from "../../../server/services/users/implementations/create.service"
import GeneratePasswordHashService from "../../../server/services/users/implementations/generate-password-hash.service"
import EmailAlreadyInUseError from "../../../server/errors/users/email-already-in-use.error"
import ApiCaller, { ApiCallerError, ApiCallerResponse } from "../../utils/api-caller.util"
import FakeUserService from "../../fakes/services/user.fake"

// BDD01
describe("[BDD] Create users", () => {
  const URL = SERVER_URL + "/api/users"
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
    const nameValidationMessage = getValidationMessageForName(name)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    const foundUserByEmail = await userDataAccess.findByEmail(email)
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(foundUserByEmail).toBeNull()
    // When
    let response: ApiCallerResponse<void> = undefined
    let requestErr: ApiCallerError = undefined
    try {
      response = await ApiCaller.createUser({ name, email, password })
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
    const nameValidationMessage = getValidationMessageForName(name)
    // Given
    expect(nameValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.createUser({ name, email, password })
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
    const emailValidationMessage = getValidationMessageForEmail(email)
    // Given
    expect(emailValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.createUser({ name, email, password })
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
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(passwordValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.createUser({ name, email, password })
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
    const nameValidationMessage = getValidationMessageForName(otherName)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(otherPassword)
    await createUserService.execute({ name, email, password })
    const registeredUser = await findUserByEmailService.execute(email)
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).not.toBeNull()
    // When
    let requestErr: ApiCallerError = undefined
    try {
      await ApiCaller.createUser({ name: otherName, email, password: otherPassword })
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
