export default class UnauthenticatedRequestError extends Error {
  public static message =
    "The request has no authentication headers (authentication_token) set. But it is required"

  constructor(msg?: string) {
    if (msg) {
      super(UnauthenticatedRequestError.message + ". " + msg)
    } else {
      super(UnauthenticatedRequestError.message)
    }
  }
}
