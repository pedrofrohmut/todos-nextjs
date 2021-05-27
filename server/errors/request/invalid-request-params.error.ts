export default class InvalidRequestParamsError extends Error {
  public static message = "The request param(s) is/are invalid. Could not be used to identify the resource"

  constructor(msg?: string) {
    if (msg) {
      super(InvalidRequestParamsError.message + ". " + msg)
    } else {
      super(InvalidRequestParamsError.message)
    }
  }
}
