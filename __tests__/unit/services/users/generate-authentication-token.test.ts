import { verify } from "jsonwebtoken"

import GenerateAuthenticationTokenService from "../../../../server/services/users/implementations/generate-authentication-token.service"

type DecodedTokenType = { userId: string; iat: number }

// Case 20
describe("[Service] Generate authentication token service", () => {
  // Dependencies
  const generateAuthenticationTokenService = new GenerateAuthenticationTokenService()

  // 1
  test("Auth token can be decoded without error", async () => {
    // Setup
    const userId = "userId201"
    const token = await generateAuthenticationTokenService.execute(userId)
    try {
      // Test
      const decoded = verify(token, process.env.JWT_SECRET)
      // Evaluation
      expect(decoded).toBeDefined()
    } catch (err) {
      // Evaluation
      expect(err).not.toBeDefined()
    }
  })

  // 2
  test("Auth token userId is the same provided to generation", async () => {
    // Setup
    const userId = "userId202"
    // Test
    const token = await generateAuthenticationTokenService.execute(userId)
    // Evaluation
    const decoded = verify(token, process.env.JWT_SECRET) as DecodedTokenType
    expect(decoded.userId).toBe(userId)
  })
})
