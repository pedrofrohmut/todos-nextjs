export default class MissingRequestParamsError extends Error {
  public static message = "The request param(s) is/are missing. But it is required to identify the resource"

  constructor(msg?: string) {
    if (msg) {
      super(MissingRequestParamsError.message + ". " + msg)
    } else {
      super(MissingRequestParamsError.message)
    }
  }
}
