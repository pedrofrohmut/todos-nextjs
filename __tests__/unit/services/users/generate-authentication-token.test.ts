import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"
import { AuthenticationTokenType } from "../../../../server/types/user.types"
import FakeTokenService from "../../../fakes/services/token.fake"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 20
describe("[Service] Generate authentication token service", () => {
  // Dependencies
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()

  // 1
  test("Auth token can be decoded without error", async () => {
    // Setup
    const { id: userId } = FakeUserService.getNew("201")
    const token = generateAuthenticationTokenService.execute(userId)
    // Test
    let decodeTokenErr: Error = undefined
    try {
      FakeTokenService.decodeToken(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).not.toBeDefined()
  })

  // 2
  test("Auth token userId is the same provided to generation", async () => {
    // Setup
    const { id: userId } = FakeUserService.getNew("202")
    const token = generateAuthenticationTokenService.execute(userId)
    // Test
    let decodeTokenErr: Error = undefined
    let decoded: AuthenticationTokenType = undefined
    try {
      decoded = FakeTokenService.decodeToken(token)
    } catch (err) {
      decodeTokenErr = err
    }
    // Evaluation
    expect(decodeTokenErr).not.toBeDefined()
    expect(decoded).toBeDefined()
    expect(decoded.userId).toBe(userId)
  })
})
