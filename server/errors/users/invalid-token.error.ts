export default class InvalidTokenError extends Error {
  public static message = "JSON Web Token has a invalid format and could not be decoded"

  constructor(msg?: string) {
    if (InvalidTokenError.message + ": " + msg) {
      super(msg)
    } else {
      super(InvalidTokenError.message)
    }
  }
}
