import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../../server/validation/user"

// Case 16
describe("[Validation] User", () => {
  test("it returns a message for invalid name", () => {
    // Setup
    const nameValidationMessage1 = getValidationMessageForName(undefined)
    const nameValidationMessage2 = getValidationMessageForName("")
    const nameValidationMessage3 = getValidationMessageForName("ab")
    const nameValidationMessage4 = getValidationMessageForName(
      "Adipisicing ipsum repellat consectetur in sequi officia sapiente! Itaque quos unde nihil omnis assumenda deleniti Magni libero ipsam iure quia laborum Officia cum harum dolores alias odit molestias? Excepturi aperiam libero nisi ratione in?"
    )
    expect(nameValidationMessage1).not.toBeNull()
    expect(nameValidationMessage2).not.toBeNull()
    expect(nameValidationMessage3).not.toBeNull()
    expect(nameValidationMessage4).not.toBeNull()
  })

  test("it returns a message for invalid email", () => {
    const emailValidationMessage1 = getValidationMessageForEmail(undefined)
    const emailValidationMessage2 = getValidationMessageForEmail("")
    const emailValidationMessage3 = getValidationMessageForEmail("john_doe161")
    expect(emailValidationMessage1).not.toBeNull()
    expect(emailValidationMessage2).not.toBeNull()
    expect(emailValidationMessage3).not.toBeNull()
  })

  test("it returns a message for invalid password", () => {
    const passwordValidationMessage1 = getValidationMessageForPassword(undefined)
    const passwordValidationMessage2 = getValidationMessageForPassword("")
    const passwordValidationMessage3 = getValidationMessageForPassword("12")
    const passwordValidationMessage4 = getValidationMessageForPassword(
      "Lorem autem sapiente modi aliquam animi? Neque fugiat minus ea nihil pariatur repudiandae? Quod delectus saepe labore vitae pariatur. Laborum."
    )
    expect(passwordValidationMessage1).not.toBeNull()
    expect(passwordValidationMessage2).not.toBeNull()
    expect(passwordValidationMessage3).not.toBeNull()
    expect(passwordValidationMessage4).not.toBeNull()
  })

  test("it returns no message for a valid name", () => {
    const nameValidationMessage = getValidationMessageForName("John Doe 162")
    expect(nameValidationMessage).toBeNull()
  })

  test("it returns no message for a valid email", () => {
    const emailValidationMessage = getValidationMessageForEmail("john_doe162@mail.com")
    expect(emailValidationMessage).toBeNull()
  })

  test("it returns no message for a valid password", () => {
    const passwordValidationMessage = getValidationMessageForPassword("password162")
    expect(passwordValidationMessage).toBeNull()
  })
})
