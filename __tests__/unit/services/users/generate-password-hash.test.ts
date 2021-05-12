import { compare } from "bcryptjs"
import generatePasswordHashService from "../../../../server/services/users/generate-password-hash"

describe("[Service] Generate password hash", () => {
  test("Generated hash to match the password that is provided", async () => {
    // Setup
    const password = "123456"
    // Test
    const passwordHash = await generatePasswordHashService(password)
    const isMatch = await compare(password, passwordHash)
    // Evaluation
    expect(isMatch).toBe(true)
  })

  test("Generated hash NOT to match a different password", async () => {
    // Setup
    const password = "123456"
    const differentPassword = "@@@@@@"
    // Test
    const passwordHash = await generatePasswordHashService(password)
    const isMatch = await compare(differentPassword, passwordHash)
    // Evaluation
    expect(isMatch).toBe(false)
  })
})