import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import UnauthenticatedRequestError from "../../../../server/errors/request/unauthenticated-request.error"
import ExpiredTokenError from "../../../../server/errors/users/expired-token.error"
import InvalidTokenError from "../../../../server/errors/users/invalid-token.error"
import TokenWithInvalidUserIdError from "../../../../server/errors/users/token-with-invalid-user-id.error"
import TokenWithoutUserIdError from "../../../../server/errors/users/token-without-user-id.error"
import UserNotFoundByIdError from "../../../../server/errors/users/user-not-found-by-id.error"
import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import { SignedUserType } from "../../../../server/types/users.types"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"

import FakeTokenService from "../../../fakes/services/token.fake"
import FakeUserService from "../../../fakes/services/user.fake"
import UsersApi from "../../../../view/api/users.api"
import { ApiError, ApiResponse } from "../../../../view/api/api.types"

// Case 24
// 1 - No AuthToken in req headers returns 401 and message
// 2 - Invalid token return 400 and message
// 3 - ExpiredTokenError return 400 and message
// 4 - Token without user id return 400 and message
// 5 - Token with invalid user id return 400 and message
// 6 - Token whit a userId that is not registered returns 400 and message
// 7 - Valid token returns 200 and SignedUserData
describe("[Controller] Get Signed User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("No auth headers", async () => {
    // Setup
    const emptyHeaders = {}
    // Test
    let requestErr: ApiError = undefined
    try {
      // @ts-ignore
      await UsersApi.getSignedUser(emptyHeaders)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(401)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(UnauthenticatedRequestError.message)
  })

  // 2
  test("Invalid Token", async () => {
    // Setup
    const invalidToken = FakeTokenService.getInvalid()
    const headers = { authentication_token: invalidToken }
    // Test
    let requestErr: ApiError = undefined
    try {
      await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(InvalidTokenError.message)
  })

  // 3
  test("Expired token", async () => {
    // Setup
    const expiredToken = FakeTokenService.getExpired()
    const headers = { authentication_token: expiredToken }
    // Test
    let requestErr: ApiError = undefined
    try {
      await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(ExpiredTokenError.message)
  })

  // 4
  test("Token withour userId", async () => {
    // Setup
    const tokenWithoutUserId = FakeTokenService.getWithoutUserId()
    const headers = { authentication_token: tokenWithoutUserId }
    // Test
    let requestErr: ApiError = undefined
    try {
      await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(TokenWithoutUserIdError.message)
  })

  // 5
  test("Token with invalid user id", async () => {
    // Setup
    const tokenWithInvalidUserId = FakeTokenService.getWithIvalidUserId()
    const headers = { authentication_token: tokenWithInvalidUserId }
    // Test
    let requestErr: ApiError = undefined
    try {
      await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(TokenWithInvalidUserIdError.message)
  })

  // 6
  test("User not found by token's userId", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("246")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    await userDataAccess.deleteById(userId)
    const tokenWithUserNotRegistered = generateAuthenticationTokenService.execute(userId)
    const headers = { authentication_token: tokenWithUserNotRegistered }
    // Test
    let requestErr: ApiError = undefined
    try {
      await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(UserNotFoundByIdError.message)
  })

  // 7
  test("Valid token, valid userId and registered user", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("247")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const validToken = generateAuthenticationTokenService.execute(userId)
    const headers = { authentication_token: validToken }
    // Test
    let requestErr: ApiError = undefined
    let response: ApiResponse<SignedUserType> = undefined
    try {
      response = await UsersApi.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Evaluation
    expect(requestErr).not.toBeDefined()
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.id).toBeDefined()
    expect(response.body.id).toBe(userId)
    expect(response.body.name).toBeDefined()
    expect(response.body.name).toBe(name)
    expect(response.body.email).toBeDefined()
    expect(response.body.email).toBe(email)
  })
})
