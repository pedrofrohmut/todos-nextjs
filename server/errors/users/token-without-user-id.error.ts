export default class TokenWithoutUserIdError extends Error {
  public static message = "Token has no user id but it is required"

  constructor(msg?: string) {
    if (TokenWithoutUserIdError.message + ": " + msg) {
      super(msg)
    } else {
      super(TokenWithoutUserIdError.message)
    }
  }
}
