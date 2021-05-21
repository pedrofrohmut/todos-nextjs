import axios, { AxiosError } from "axios"

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

  //11
  test("Scenario 1 - valid credentials", async () => {
    // Setup
    const name = "John Doe BDD011"
    const email = "jhon_doeBDD011@mail.com"
    const password = "passwordBDD011"
    const nameValidationMessage = getValidationMessageForName(name)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    const registeredUser = await findUserByEmailService.execute(email)
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).toBeNull()
    // When
    const response = await axios.post(URL, { name, email, password })
    // Then
    const createdUser = await findUserByEmailService.execute(email)
    expect(createdUser).not.toBeNull()
    expect(response.status).toBe(201)
  })

  // 12
  test("Scenario 2 - invalid name (value validation)", async () => {
    // Setup
    const name = ""
    const nameValidationMessage = getValidationMessageForName(name)
    let requestErr: AxiosError = undefined
    // Given
    expect(nameValidationMessage).not.toBeNull()
    // When
    try {
      await axios.post(URL, { name, email: "john_doeBDD012@mail.com", password: "passwordBDD012" })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(nameValidationMessage)
  })

  // 13
  test("Scenario 3 - invalid email (value validation)", async () => {
    // Setup
    const email = ""
    const emailValidationMessage = getValidationMessageForEmail(email)
    let requestErr: AxiosError = undefined
    // Given
    expect(emailValidationMessage).not.toBeNull()
      // When
    try {
      await axios.post(URL, { name: "John Doe BDD013", email, password: "passwordBDD013" })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(emailValidationMessage)
  })

  // 14
  test("Scenario 4 - invalid password (value validation)", async () => {
    // Setup
    const password = ""
    const passwordValidationMessage = getValidationMessageForPassword(password)
    let requestErr: AxiosError = undefined
    // Given
    expect(passwordValidationMessage).not.toBeNull()
      // When
    try {
      await axios.post(URL, { name: "John Doe BDD014", email: "john_doeBDD014@mail.com", password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(passwordValidationMessage)
  })

  // 15
  test("Scenario 5 - E-mail is already in registered", async () => {
    // Setup
    const name = "John Doe BDD015"
    const email = "john_doeBDD015@mail.com"
    const password = "passwordBDD015"
    const nameValidationMessage = getValidationMessageForName(name)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    await createUserService.execute({
      name: "John Doe BDD015A",
      email,
      password: "passwordBDD015A"
    })
    const registeredUser = await findUserByEmailService.execute(email)
    let requestErr: AxiosError = undefined
    // Given
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).not.toBeNull()
      // When
    try {
      await axios.post(URL, { name, email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(EmailAlreadyInUseError.message)
  })
})
