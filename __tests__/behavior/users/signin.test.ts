import axios, { AxiosError } from "axios"

import { SERVER_URL } from "../../constants"
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

// BDD02
describe("[BDD] Sign In", () => {
  const URL = SERVER_URL + "/api/users/signin"
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
    const email = "john_doeBDD021@mail.com"
    const password = "passwordBDD021"
    await createUserService.execute({ name: "John Doe BDD021", email, password })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    const registeredUser = await findUserByEmailService.execute(email)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).not.toBeNull()
    // When
    const response = await axios.post(URL, { email, password })
    // Then
    const { user, token } = response.data
    expect(user.id).toBeDefined()
    expect(user.id).toBe(registeredUser.id)
    expect(user.name).toBeDefined()
    expect(user.name).toBe(registeredUser.name)
    expect(user.email).toBeDefined()
    expect(user.email).toBe(registeredUser.email)
    expect(token).toBeDefined()
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })

  // 22
  test("Scenario 2 - invalid e-mail (value validation)", async () => {
    // Setup
    const email = ""
    const password = "passwordBDD022"
    const emailValidationMessage = getValidationMessageForEmail(email)
    // Given
    expect(emailValidationMessage).not.toBeNull()
    // When
    let requestErr: AxiosError = undefined
    try {
      await axios.post(URL, { email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).not.toBeNull()
    expect(requestErr.response.data).toBe(emailValidationMessage)
  })

  // 23
  test("Scenario 3 - invalid password (value validation)", async () => {
    // Setup
    const email = "john_doeBDD023@mail.com"
    const password = ""
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(passwordValidationMessage).not.toBeNull()
    // When
    let requestErr: AxiosError = undefined
    try {
      await axios.post(URL, { email, password })
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

  // 24
  test("Scenario 4 - e-mail is not registered", async () => {
    // Setup
    const email = "john_doeBDD024@mail.com"
    const password = "passwordBDD024"
    const registeredUser = await findUserByEmailService.execute(email)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(registeredUser).toBeNull()
    // When
    let requestErr: AxiosError = undefined
    try {
      await axios.post(URL, { email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(UserNotFoundByEmailError.message)
  })

  // 25
  test("Scenario 5 - password is not a match", async () => {
    // Setup
    const email = "john_doeBDD025@mail.com"
    const password = "passwordBDD025"
    const differentPassword = password + "__IM_DIFFERENT__"
    await createUserService.execute({ name: "John Doe BDD025", email, password })
    const emailValidationMessage = getValidationMessageForEmail(email)
    const differentPasswordValidationMessage = getValidationMessageForPassword(differentPassword)
    const registeredUser = await findUserByEmailService.execute(email)
    // Given
    expect(emailValidationMessage).toBeNull()
    expect(differentPasswordValidationMessage).toBeNull()
    expect(registeredUser).not.toBeNull()
    // Then
    let requestErr: AxiosError = undefined
    try {
      await axios.post(URL, { email, password: differentPassword })
    } catch (err) {
      requestErr = err
    }
    // When
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(PasswordIsNotAMatchError.message)
  })
})
