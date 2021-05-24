import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 15
describe("[Service] Generate password hash", () => {
  const generatePasswordHashService = new GeneratePasswordHashService()

  // 151
  test("Generated hash to match the password that is provided", async () => {
    // Setup
    const { password } = FakeUserService.getNew("151")
    // Test
    let passwordHash: string = undefined
    let hashErr: Error = undefined
    try {
      passwordHash = await generatePasswordHashService.execute(password)
    } catch (err) {
      hashErr = err
    }
    // Setup 2
    const isPasswordMatch = await FakeUserService.comparePasswordAndHash(password, passwordHash)
    // Evaluation
    expect(hashErr).not.toBeDefined()
    expect(isPasswordMatch).toBe(true)
  })

  // 152
  test("Generated hash NOT to match a different password", async () => {
    // Setup
    const { password } = FakeUserService.getNew("152A")
    const { password: otherPassword } = FakeUserService.getNew("152B")
    // Test
    let passwordHash: string = undefined
    let hashErr: Error = undefined
    try {
      passwordHash = await generatePasswordHashService.execute(password)
    } catch (err) {
      hashErr = err
    }
    const isPasswordMatch = await FakeUserService.comparePasswordAndHash(otherPassword, passwordHash)
    // Evaluation
    expect(hashErr).not.toBeDefined()
    expect(isPasswordMatch).toBe(false)
  })
})
