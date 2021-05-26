import UserDataAccess from "../../../server/data-access/implementations/users.data-access"
import AuthenticationTokenDecoderService from "../../../server/services/users/implementations/authentication-token-decoder.service"
import CreateUserService from "../../../server/services/users/implementations/create.service"
import FindUserByEmailService from "../../../server/services/users/implementations/find-by-email.service"
import GenerateAuthenticationTokenService from "../../../server/services/users/implementations/generate-authentication-token.service"
import GeneratePasswordHashService from "../../../server/services/users/implementations/generate-password-hash.service"
import FindUserByIdService from "../../../server/services/users/implementations/find-by-id.service"
import { AuthenticationToken, SignedUserType } from "../../../server/types/users.types"
import ConnectionFactory from "../../../server/utils/connection-factory.util"
import DeleteUserByEmailService from "../../../server/services/users/implementations/delete-by-email.service"
import InvalidTokenError from "../../../server/errors/users/invalid-token.error"
import UserNotFoundByIdError from "../../../server/errors/users/user-not-found-by-id.error"
import TokenWithoutUserIdError from "../../../server/errors/users/token-without-user-id.error"
import ExpiredTokenError from "../../../server/errors/users/expired-token.error"
import TokenWithInvalidUserIdError from "../../../server/errors/users/token-with-invalid-user-id.error"
import { getValidationMessageForUserId } from "../../../server/validators/users.validator"
import UnauthenticatedRequestError from "../../../server/errors/request/unauthenticated-request.error"

import UsersApiCaller from "../../../view/api/users.api"
import { ApiError, ApiResponse } from "../../../view/api/api.types"
import FakeUserService from "../../fakes/services/user.fake"
import FakeTokenService from "../../fakes/services/token.fake"

// BDD03
describe("[BDD] Get Signed User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()
  const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
  const findUserByIdService = new FindUserByIdService(userDataAccess)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 31
  test("Scenario 1: valid authToken", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("BDD031")
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const userIdValidationMessage = getValidationMessageForUserId(createdUser.id)
    const token = generateAuthenticationTokenService.execute(createdUser.id)
    let decoded: AuthenticationToken = undefined
    let decodeTokenErr: Error = undefined
    try {
      decoded = FakeTokenService.decodeToken(token)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: token }
    // Given
    expect(createdUser).not.toBeNull()
    expect(userIdValidationMessage).toBeNull()
    expect(decodeTokenErr).not.toBeDefined()
    expect(decoded).toBeDefined()
    expect(decoded.userId).toBeDefined()
    expect(decoded.exp).toBeDefined()
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(token)
    // When
    let response: ApiResponse<SignedUserType> = undefined
    let requestErr: ApiError = undefined
    try {
      response = await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).not.toBeDefined()
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.id).toBeDefined()
    expect(response.body.id).toBe(createdUser.id)
    expect(response.body.name).toBeDefined()
    expect(response.body.name).toBe(name)
    expect(response.body.email).toBeDefined()
    expect(response.body.email).toBe(email)
  })

  // 32
  test("Scenario 2: user from authToken is not registered", async () => {
    const email = "john_doeBDD32@mail.com"
    await createUserService.execute({
      name: "John Doe BDD32",
      email,
      password: "passwordBDD32"
    })
    const foundUser = await findUserByEmailService.execute(email)
    const userId = foundUser.id
    await deleteUserByEmailService.execute(email)
    const foundUserById = await findUserByIdService.execute(userId)
    const token = generateAuthenticationTokenService.execute(userId)
    let decoded: AuthenticationToken = undefined
    let decodeTokenErr: Error
    try {
      decoded = authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: token }
    // Given
    expect(decodeTokenErr).not.toBeDefined()
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(token)
    expect(decoded.userId).toBeDefined()
    expect(foundUserById).toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(UserNotFoundByIdError.message)
  })

  // 33
  test("Scenario 3: authToken is not valid", async () => {
    const invalidToken = ""
    let decodeTokenErr: Error
    try {
      authenticationTokenDecoderService.execute(invalidToken)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: invalidToken }
    // Given
    expect(decodeTokenErr).toBeDefined()
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(invalidToken)
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(InvalidTokenError.message)
  })

  // 34
  test("Scenario 4: authToken without userId", async () => {
    // Setup
    const token = FakeTokenService.getWithoutUserId()
    let decoded: AuthenticationToken = undefined
    let decodeTokenErr: Error = undefined
    try {
      decoded = authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: token }
    // Given
    expect(decodeTokenErr).not.toBeDefined()
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(token)
    expect(decoded.userId).not.toBeDefined()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(TokenWithoutUserIdError.message)
  })

  // 35
  test("Scenario 5: authToken experied", async () => {
    // Setup
    const token = FakeTokenService.getExpired()
    let decodeTokenErr: Error = undefined
    try {
      authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: token }
    // Given
    expect(decodeTokenErr instanceof InvalidTokenError).not.toBe(true)
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(token)
    expect(decodeTokenErr instanceof ExpiredTokenError).toBe(true)
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(ExpiredTokenError.message)
  })

  // 36
  test("Scenario 6: invalid userId in the authToken", async () => {
    // Setup
    const userId = ""
    const token = generateAuthenticationTokenService.execute(userId)
    let decoded: AuthenticationToken = undefined
    let decodeTokenErr: Error = undefined
    try {
      decoded = authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: token }
    const userIdValidationMessage = getValidationMessageForUserId(userId)
    // Given
    expect(decodeTokenErr).not.toBeDefined()
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(token)
    expect(decoded.userId).toBeDefined()
    expect(userIdValidationMessage).not.toBeNull()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(400)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(TokenWithInvalidUserIdError.message)
  })

  test("Scenario 7: authToken request header not defined", async () => {
    // Setup
    const headers = {}
    // Given
    // @ts-ignore
    expect(headers.authentication_token).not.toBeDefined()
    // When
    let requestErr: ApiError = undefined
    try {
      await UsersApiCaller.getSignedUser(headers)
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.status).toBeDefined()
    expect(requestErr.status).toBe(401)
    expect(requestErr.body).toBeDefined()
    expect(requestErr.body).toBe(UnauthenticatedRequestError.message)
  })
})
