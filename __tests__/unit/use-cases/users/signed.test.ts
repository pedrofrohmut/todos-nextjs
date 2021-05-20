import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import ExpiredTokenError from "../../../../server/errors/users/expired-token.error"
import InvalidTokenError from "../../../../server/errors/users/invalid-token.error"
import TokenWithInvalidUserIdError from "../../../../server/errors/users/token-with-invalid-user-id.error"
import TokenWithoutUserIdError from "../../../../server/errors/users/token-without-user-id.error"
import UserNotFoundByIdError from "../../../../server/errors/users/user-not-found-by-id.error"
import AuthenticationTokenDecoderService from "../../../../server/services/users/implementations/authentication-token-decoder.service"
import FindUserByIdService from "../../../../server/services/users/implementations/find-by-id.service"
import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import {SignedUserType} from "../../../../server/types/users.types"
import SignedUseCase from "../../../../server/use-cases/users/implementations/signed.use-case"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import FakeTokenService from "../../../fakes/services/token.fake"
import FakeUserService from "../../../fakes/services/user.fake"

// case 23
// 1 - Invalid token
// 2 - Expired Token
// 3 - Token without userId
// 4 - Token with invalid userId
// 5 - User not found by token userId
// 6 - valid token returns signedData
describe("[Use Case] Get Signed User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
  const findUserByIdService = new FindUserByIdService(userDataAccess)
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()
  const signedUseCase = new SignedUseCase(findUserByIdService, authenticationTokenDecoderService)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("Invalid token throw error", async () => {
    // Setup
    const token = FakeTokenService.getInvalid()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      await signedUseCase.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof InvalidTokenError).toBe(true)
    expect(decodeTokenErr.message).toBe(InvalidTokenError.message)
  })

  // 2
  test("Expired token throw error", async () => {
    // Setup
    const token = FakeTokenService.getExpired()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      await signedUseCase.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof ExpiredTokenError).toBe(true)
    expect(decodeTokenErr.message).toBe(ExpiredTokenError.message)
  })

  // 3
  test("Token without userId", async () => {
    // Setup
    const token = FakeTokenService.getWithoutUserId()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      await signedUseCase.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof TokenWithoutUserIdError).toBe(true)
    expect(decodeTokenErr.message).toBe(TokenWithoutUserIdError.message)
  })

  // 4
  test("Token with invalid userId", async () => {
    // Setup
    const token = FakeTokenService.getWithIvalidUserId()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      await signedUseCase.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof TokenWithInvalidUserIdError).toBe(true)
    expect(decodeTokenErr.message).toBe(TokenWithInvalidUserIdError.message)
  })

  // 5
  test("User not found with token's userId", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("235")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    await userDataAccess.deleteById(userId)
    const token = generateAuthenticationTokenService.execute(userId)
    let tokenErr: Error = undefined
    // Test
    try {
      await signedUseCase.execute(token)
    } catch (err) {
      tokenErr = err
    }
    // Evaluation
    expect(tokenErr).toBeDefined()
    expect(tokenErr instanceof UserNotFoundByIdError).toBe(true)
    expect(tokenErr.message).toBe(UserNotFoundByIdError.message)
  })

  // 6
  test("Valid token with valid userId and user registered and return signedData", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("236")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const token = generateAuthenticationTokenService.execute(userId)
    let signedErr: Error = undefined
    let signedUser: SignedUserType
    // Test
    try {
      signedUser = await signedUseCase.execute(token)
    } catch (err) {
      signedErr = err
    }
    // Evaluation
    expect(signedErr).not.toBeDefined()
    expect(signedUser).toBeDefined()
    expect(signedUser.id).toBe(userId)
    expect(signedUser.name).toBe(name)
    expect(signedUser.email).toBe(email)
  })
})
