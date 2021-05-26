import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import EmailAlreadyInUseError from "../../../../server/errors/users/email-already-in-use.error"

import FakeUserService from "../../../fakes/services/user.fake"
import UsersApi from "../../../../view/api/users.api"
import { ApiError, ApiResponse } from "../../../../view/api/api.types"


// Case 11
// E-mail already in use returns 400 and message
// Valid creadentials create user and returns 201
describe("[Controller] Create User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)

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
    let requestErr: ApiError = undefined
    try {
      await UsersApi.createUser({ name, email, password })
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
    let response: ApiResponse<void> = undefined
    let requestErr: ApiError = undefined
    try {
      response = await UsersApi.createUser({ name, email, password })
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
