export default class EmailAlreadyInUseError extends Error {
  public static message = "E-mail is already taken and must be unique"

  constructor(msg?: string) {
    if (msg) {
      super(EmailAlreadyInUseError.message + ". " + msg)
    } else {
      super(EmailAlreadyInUseError.message)
    }
  }
}
