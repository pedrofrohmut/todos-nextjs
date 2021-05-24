export default class ExpiredTokenError extends Error {
  public static message =
    "The Token has expired and is no longer valid. Please sign in to get a new one"

  constructor(message?: string) {
    if (message) {
      super(ExpiredTokenError.message + ". " + message)
    } else {
      super(ExpiredTokenError.message)
    }
  }
}
