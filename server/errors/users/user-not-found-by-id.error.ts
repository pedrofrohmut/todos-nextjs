export default class UserNotFoundByIdError extends Error {
  public static message = "User not found with the given userId address"

  constructor(msg?: string) {
    if (msg) {
      super(UserNotFoundByIdError.message + ": " + msg)
    } else {
      super(UserNotFoundByIdError.message)
    }
  }
}
