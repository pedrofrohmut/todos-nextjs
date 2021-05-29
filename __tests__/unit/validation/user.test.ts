import UserValidator from "../../../server/validators/user.validator"
import FakeUserService from "../../fakes/services/user.fake"

// Case 16
// 1 - userIdValidation
// 2 - nameValidation
// 3 - emailValidation
// 4 - passwordValidation
describe("[Validation] User", () => {
  // 1
  test("UserId validation", () => {
    // Setup
    const invalidUserId = FakeUserService.getInvalidUserId()
    const { id: validUserId } = FakeUserService.getNew("161")
    // Test
    const msg1 = UserValidator.getMessageForUserId(undefined)
    const msg2 = UserValidator.getMessageForUserId("")
    const msg3 = UserValidator.getMessageForUserId(invalidUserId)
    const msg4 = UserValidator.getMessageForUserId(validUserId)
    // Evaluation
    expect(msg1).not.toBeNull()
    expect(msg2).not.toBeNull()
    expect(msg3).not.toBeNull()
    expect(msg4).toBeNull()
  })

  // 2
  test("Name validation", () => {
    // Setup
    const { name: validName } = FakeUserService.getNew("162")
    // Test
    const msg1 = UserValidator.getMessageForName(undefined)
    const msg2 = UserValidator.getMessageForName("")
    const msg3 = UserValidator.getMessageForName("ab")
    const msg4 = UserValidator.getMessageForName(
      "Adipisicing ipsum repellat consectetur in sequi officia sapiente! Itaque quos unde nihil omnis assumenda deleniti Magni libero ipsam iure quia laborum Officia cum harum dolores alias odit molestias? Excepturi aperiam libero nisi ratione in?"
    )
    const msg5 = UserValidator.getMessageForName(validName)
    // Evaluation
    expect(msg1).not.toBeNull()
    expect(msg2).not.toBeNull()
    expect(msg3).not.toBeNull()
    expect(msg4).not.toBeNull()
    expect(msg5).toBeNull()
  })

  // 3
  test("E-mail validation", () => {
    // Setup
    const { email: validEmail } = FakeUserService.getNew("163")
    // Test
    const msg1 = UserValidator.getMessageForEmail(undefined)
    const msg2 = UserValidator.getMessageForEmail("")
    const msg3 = UserValidator.getMessageForEmail("john_doe161")
    const msg4 = UserValidator.getMessageForEmail(validEmail)
    // Evaluation
    expect(msg1).not.toBeNull()
    expect(msg2).not.toBeNull()
    expect(msg3).not.toBeNull()
    expect(msg4).toBeNull()
  })

  // 4
  test("it returns a message for invalid password", () => {
    // Setup
    const { password: validPassword } = FakeUserService.getNew("164")
    // Test
    const msg1 = UserValidator.getMessageForPassword(undefined)
    const msg2 = UserValidator.getMessageForPassword("")
    const msg3 = UserValidator.getMessageForPassword("12")
    const msg4 = UserValidator.getMessageForPassword(
      "Lorem autem sapiente modi aliquam animi? Neque fugiat minus ea nihil pariatur repudiandae? Quod delectus saepe labore vitae pariatur. Laborum."
    )
    const msg5 = UserValidator.getMessageForPassword(validPassword)
    // Evaluation
    expect(msg1).not.toBeNull()
    expect(msg2).not.toBeNull()
    expect(msg3).not.toBeNull()
    expect(msg4).not.toBeNull()
    expect(msg5).toBeNull()
  })
})
