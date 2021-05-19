export default class ExpiredTokenError extends Error {
  public static message = "Token has no user id but it is required"

  constructor(msg?: string) {
    if (ExpiredTokenError.message + ": " + msg) {
      super(msg)
    } else {
      super(ExpiredTokenError.message)
    }
  }
}
