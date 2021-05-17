import { compare } from "bcryptjs"

import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"

// Case 15
describe("[Service] Generate password hash", () => {
  test("Generated hash to match the password that is provided", async () => {
    const generatePasswordHashService = new GeneratePasswordHashService()
    // Setup
    const password = "123456"
    // Test
    const passwordHash = await generatePasswordHashService.execute(password)
    const isMatch = await compare(password, passwordHash)
    // Evaluation
    expect(isMatch).toBe(true)
  })

  test("Generated hash NOT to match a different password", async () => {
    const generatePasswordHashService = new GeneratePasswordHashService()
    // Setup
    const password = "123456"
    const differentPassword = "@@@@@@"
    // Test
    const passwordHash = await generatePasswordHashService.execute(password)
    const isMatch = await compare(differentPassword, passwordHash)
    // Evaluation
    expect(isMatch).toBe(false)
  })
})
