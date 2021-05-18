import CheckPasswordService from "../../../../server/services/users/implementations/check-password.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"

// Case 19
describe("[Service] Check User Password Service", () => {
  // Dependencies
  const generatePasswordHashService = new GeneratePasswordHashService()
  const checkPasswordService = new CheckPasswordService()

  // 1
  test("Return true to a hash and to password used to create it", async () => {
    // Setup
    const password = "password191"
    const hash = await generatePasswordHashService.execute(password)
    // Test
    const isMatch = await checkPasswordService.execute(password, hash)
    // Evaluation
    expect(isMatch).toBe(true)
  })

  // 2
  test("Return false to a hash made from a different password", async () => {
    // Setup
    const password = "password192"
    const hash = await generatePasswordHashService.execute(password)
    const differentPassword = "different_password192"
    // Test
    const isMatch = await checkPasswordService.execute(differentPassword, hash)
    // Evaluation
    expect(isMatch).not.toBe(true)
  })
})
