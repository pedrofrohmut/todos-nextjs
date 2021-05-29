import AuthenticationTokenDecoderService from "../../../../server/services/users/implementations/authentication-token-decoder.service"
import { AuthenticationTokenType } from "../../../../server/types/user.types"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-user-by-email.service"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import CreateUserService from "../../../../server/services/users/implementations/create-user.service"
import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import UserDataAccess from "../../../../server/data-access/implementations/user.data-access"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-user-by-email.service"
import InvalidTokenError from "../../../../server/errors/users/invalid-token.error"
import ExpiredTokenError from "../../../../server/errors/users/expired-token.error"
import FakeTokenService from "../../../fakes/services/token.fake"

// Case 21
describe("[Service] Authentication token decoder service", () => {
  const conn = ConnectionFactory.getConnection()
  const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
  const userDataAccess = new UserDataAccess(conn)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 211
  test("a valid token with userId should be properly decoded", async () => {
    // Setup
    const name = "John Doe 211"
    const email = "john_doe211@mail.com"
    const password = "password211"
    await createUserService.execute({ name, email, password })
    const { id: userId } = await findUserByEmailService.execute(email)
    const token = generateAuthenticationTokenService.execute(userId)
    // Test
    let decoded: AuthenticationTokenType = undefined
    let decodeTokenErr: Error = undefined
    try {
      decoded = authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).not.toBeDefined()
    expect(decoded).toBeDefined()
    expect(decoded.userId).toBeDefined()
    expect(decoded.userId).toBe(userId)
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })

  // 212
  test("decode a invalid token should throw an error", async () => {
    const token = FakeTokenService.getInvalid()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof InvalidTokenError).toBe(true)
    expect(decodeTokenErr.message).toBe(InvalidTokenError.message)
  })

  // 213
  test("decode a expired token should throw an error", async () => {
    // Setup
    const token = FakeTokenService.getExpired()
    let decodeTokenErr: Error = undefined
    // Test
    try {
      authenticationTokenDecoderService.execute(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).toBeDefined()
    expect(decodeTokenErr instanceof ExpiredTokenError).toBe(true)
    expect(decodeTokenErr.message).toBe(ExpiredTokenError.message)
  })
})
