export class PasswordIsNotAMatchError extends Error {
  public static message = "Password does not match the hashed password"

  constructor(msg?: string) {
    if (PasswordIsNotAMatchError.message + ": " + msg) {
      super(msg)
    } else {
      super(PasswordIsNotAMatchError.message)
    }
  }
}
