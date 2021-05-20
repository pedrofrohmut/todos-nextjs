export default class InvalidTokenError extends Error {
  public static readonly message = "JSON Web Token has a invalid format and could not be decoded"

  constructor(message?: string) {
    if (message) {
      super(InvalidTokenError.message + ". " +  message)
    } else {
      super(InvalidTokenError.message)
    }
  }
}
