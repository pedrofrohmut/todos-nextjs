import CheckPasswordService from "../../../../server/services/users/implementations/check-password.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 19
describe("[Service] Check User Password Service", () => {
  // Dependencies
  const generatePasswordHashService = new GeneratePasswordHashService()
  const checkPasswordService = new CheckPasswordService()

  // 1
  test("Return true to a hash and to password used to create it", async () => {
    // Setup
    const { password } = FakeUserService.getNew("191")
    const hash = await generatePasswordHashService.execute(password)
    // Test
    let matchErr: Error = undefined
    let isMatch: boolean = undefined
    try {
      isMatch = await checkPasswordService.execute(password, hash)
    } catch (err) {
      matchErr = err
    }
    // Evaluation
    expect(matchErr).not.toBeDefined()
    expect(isMatch).toBe(true)
  })

  // 2
  test("Return false to a hash made from a different password", async () => {
    // Setup
    const { password } = FakeUserService.getNew("192A")
    const hash = await generatePasswordHashService.execute(password)
    const { password: otherPassword } = FakeUserService.getNew("192B")
    // Test
    let matchErr: Error = undefined
    let isMatch: boolean = undefined
    try {
      isMatch = await checkPasswordService.execute(otherPassword, hash)
    } catch (err) {
      matchErr = err
    }
    // Evaluation
    expect(matchErr).not.toBeDefined()
    expect(isMatch).not.toBe(true)
  })
})
