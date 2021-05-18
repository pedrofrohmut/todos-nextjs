export default class EmailAlreadyInUseError extends Error {
  public static message = "E-mail is already taken and must be unique"

  constructor(msg?: string) {
    if (EmailAlreadyInUseError.message + ": " + msg) {
      super(msg)
    } else {
      super(EmailAlreadyInUseError.message)
    }
  }
}
