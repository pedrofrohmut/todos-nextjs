export class UserNotFoundByEmailError extends Error {
  public static message = "User not found with the given e-mail address"

  constructor(msg?: string) {
    if (UserNotFoundByEmailError.message + ": " + msg) {
      super(msg)
    } else {
      super(UserNotFoundByEmailError.message)
    }
  }
}
