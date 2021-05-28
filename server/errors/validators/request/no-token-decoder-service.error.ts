export default class NoDecoderTokenServiceError extends Error {
  public static message = "Request validator cannot validate the token without a decoder service"

  constructor(msg?: string) {
    if (msg) {
      super(NoDecoderTokenServiceError.message + ". " + msg)
    } else {
      super(NoDecoderTokenServiceError.message)
    }
  }
}
