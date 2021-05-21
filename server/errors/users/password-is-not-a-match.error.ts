export default class PasswordIsNotAMatchError extends Error {
  public static message = "Password does not match the hashed password"

  constructor(msg?: string) {
    if (msg) {
      super(PasswordIsNotAMatchError.message + ". " + msg)
    } else {
      super(PasswordIsNotAMatchError.message)
    }
  }
}
