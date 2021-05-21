export default class UserNotFoundByEmailError extends Error {
  public static message = "User not found with the given e-mail address"

  constructor(msg?: string) {
    if (msg) {
      super(UserNotFoundByEmailError.message + ": " + msg)
    } else {
      super(UserNotFoundByEmailError.message)
    }
  }
}
