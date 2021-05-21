import axios, { AxiosError } from "axios"
import { sign, verify, TokenExpiredError } from "jsonwebtoken"

import UserDataAccess from "../../../server/data-access/implementations/users.data-access"
import AuthenticationTokenDecoderService from "../../../server/services/users/implementations/authentication-token-decoder.service"
import CreateUserService from "../../../server/services/users/implementations/create.service"
import FindUserByEmailService from "../../../server/services/users/implementations/find-by-email.service"
import GenerateAuthenticationTokenService from "../../../server/services/users/implementations/generate-authentication-token.service"
import GeneratePasswordHashService from "../../../server/services/users/implementations/generate-password-hash.service"
import FindUserByIdService from "../../../server/services/users/implementations/find-by-id.service"
import { AuthenticationToken, UserDatabaseType } from "../../../server/types/users.types"
import ConnectionFactory from "../../../server/utils/connection-factory.util"
import { SERVER_URL } from "../../constants"
import DeleteUserByEmailService from "../../../server/services/users/implementations/delete-by-email.service"
import InvalidTokenError from "../../../server/errors/users/invalid-token.error"
import UserNotFoundByIdError from "../../../server/errors/users/user-not-found-by-id.error"
import TokenWithoutUserIdError from "../../../server/errors/users/token-without-user-id.error"
import ExpiredTokenError from "../../../server/errors/users/expired-token.error"
import TokenWithInvalidUserIdError from "../../../server/errors/users/token-with-invalid-user-id.error"
import { getValidationMessageForUserId } from "../../../server/validators/users.validator"
import UnauthenticatedRequestError from "../../../server/errors/request/unauthenticated-request.error"

// BDD03
describe("[BDD] Get Signed User", () => {
  const URL = SERVER_URL + "/api/users/signed"
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
    const email = "john_doeBDD31@mail.com"
    await createUserService.execute({
      name: "John Doe BDD31",
      email,
      password: "passwordBDD31"
    })
    const createdUser = await findUserByEmailService.execute(email)
    const token = generateAuthenticationTokenService.execute(createdUser.id)
    const headers = { authentication_token: token }
    let decoded: AuthenticationToken
    let decodeTokenErr: Error
    let foundUser: UserDatabaseType = null
    try {
      decoded = authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    if (decoded) {
      foundUser = await findUserByIdService.execute(decoded.userId)
    }
    // Given
    expect(headers.authentication_token).toBeDefined()
    expect(decoded.userId).toBeDefined()
    expect(foundUser).not.toBeNull()
    expect(decodeTokenErr).not.toBeDefined()
    // When
    const response = await axios.get(URL, { headers })
    // Then
    expect(response.status).toBe(200)
    expect(response.data.id).toBeDefined()
    expect(response.data.name).toBeDefined()
    expect(response.data.email).toBeDefined()
    expect(response.data.id).toBe(foundUser.id)
    expect(response.data.name).toBe(foundUser.name)
    expect(response.data.email).toBe(foundUser.email)
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
    let requestErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(UserNotFoundByIdError.message)
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
    let requestErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(InvalidTokenError.message)
  })

  // 34
  test("Scenario 4: authToken without userId", async () => {
    // Setup
    const token = sign({}, process.env.JWT_SECRET)
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
    let requestErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      requestErr = err
    }
    // Then
    expect(requestErr).toBeDefined()
    expect(requestErr.response).toBeDefined()
    expect(requestErr.response.status).toBeDefined()
    expect(requestErr.response.status).toBe(400)
    expect(requestErr.response.data).toBeDefined()
    expect(requestErr.response.data).toBe(TokenWithoutUserIdError.message)
  })

  // 35
  test("Scenario 5: authToken experied", async () => {
    // Setup
    const expiredToken = sign({ userId: "userId" }, process.env.JWT_SECRET, { expiresIn: 0 })
    let decodeTokenErr: Error = undefined
    try {
      authenticationTokenDecoderService.execute(expiredToken)
    } catch (err) {
      decodeTokenErr = err
    }
    const headers = { authentication_token: expiredToken }
    // Given
    expect(decodeTokenErr instanceof InvalidTokenError).not.toBe(true)
    expect(headers.authentication_token).toBeDefined()
    expect(headers.authentication_token).toBe(expiredToken)
    expect(decodeTokenErr instanceof ExpiredTokenError).toBe(true)
    // When
    let expiredTokenErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      expiredTokenErr = err
    }
    // Then
    expect(expiredTokenErr).toBeDefined()
    expect(expiredTokenErr.response).toBeDefined()
    expect(expiredTokenErr.response.status).toBe(400)
    expect(expiredTokenErr.response.data).toBeDefined()
    expect(expiredTokenErr.response.data).toBe(ExpiredTokenError.message)
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
    let invalidUserIdErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      invalidUserIdErr = err
    }
    // Then
    expect(invalidUserIdErr).toBeDefined()
    expect(invalidUserIdErr.response).toBeDefined()
    expect(invalidUserIdErr.response.status).toBeDefined()
    expect(invalidUserIdErr.response.status).toBe(400)
    expect(invalidUserIdErr.response.data).toBeDefined()
    expect(invalidUserIdErr.response.data).toBe(TokenWithInvalidUserIdError.message)
  })

  test("Scenario 7: authToken request header not defined", async () => {
    // Setup
    const headers = {}
    // Given
    // @ts-ignore
    expect(headers.authentication_token).not.toBeDefined()
    // When
    let noHeadersErr: AxiosError = undefined
    try {
      await axios.get(URL, { headers })
    } catch (err) {
      noHeadersErr = err
    }
    // Then
    expect(noHeadersErr).toBeDefined()
    expect(noHeadersErr.response).toBeDefined()
    expect(noHeadersErr.response.status).toBeDefined()
    expect(noHeadersErr.response.status).toBe(401)
    expect(noHeadersErr.response.data).toBeDefined()
    expect(noHeadersErr.response.data).toBe(UnauthenticatedRequestError.message)
  })
})
