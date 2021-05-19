export default class UnauthorizedRequestError extends Error {
  public static message = "The request has no authentication headers (authentication_token) set. And it is required"

  constructor(msg?: string) {
    if (UnauthorizedRequestError.message + ": " + msg) {
      super(msg)
    } else {
      super(UnauthorizedRequestError.message)
    }
  }
}
