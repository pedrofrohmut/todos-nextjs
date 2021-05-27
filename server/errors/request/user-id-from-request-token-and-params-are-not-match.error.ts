export default class UserIdFromRequestTokenAndParamsAreNotMatchError extends Error {
  public static message = "The userId from the authentication token and the userId from the params do not match. No matching userId makes the request invalid"

  constructor(msg?: string) {
    if (msg) {
      super(UserIdFromRequestTokenAndParamsAreNotMatchError.message + ". " + msg)
    } else {
      super(UserIdFromRequestTokenAndParamsAreNotMatchError.message)
    }
  }
}
