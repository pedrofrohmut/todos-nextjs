import axios, {AxiosError, AxiosResponse} from "axios"

import { SERVER_URL } from "../../../constants"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import FakeUserService from "../../../fakes/services/user.fake"
import ApiCaller, {ApiCallerError, ApiCallerResponse} from "../../../utils/api-caller.util"
import EmailAlreadyInUseError from "../../../../server/errors/users/email-already-in-use.error"

const URL = SERVER_URL + "/api/users"

// Case 11
// E-mail already in use returns 400 and message
// Valid creadentials create user and returns 201
describe("[Controller] Create User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  test("E-mail already in use", async () => {
    // Setup.
    const { name, email, password, passwordHash } = FakeUserService.getNew("111")
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Given
    expect(createdUser).toBeDefined()
    expect(createdUser).not.toBeNull()
    expect(createdUser.email).toBe(email)
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
    expect(requestErr.body).toBe(EmailAlreadyInUseError.message)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  test("Return created when valid", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("112")
    const foundUser = await userDataAccess.findByEmail(email)
    // Given
    expect(foundUser).toBeNull()
    // When
    let response: ApiCallerResponse<void> = undefined
    let requestErr: ApiCallerError = undefined
    try {
      response = await ApiCaller.createUser({ name, email, password })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).not.toBeDefined()
    expect(response).toBeDefined()
    expect(response.status).toBe(201)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })
})
