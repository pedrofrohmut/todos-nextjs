export default class TokenWithInvalidUserIdError extends Error {
  public static message = "The token's userId is not valid"

  constructor(msg?: string) {
    if (TokenWithInvalidUserIdError.message + ": " + msg) {
      super(msg)
    } else {
      super(TokenWithInvalidUserIdError.message)
    }
  }
}
