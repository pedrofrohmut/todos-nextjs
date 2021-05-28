import {
  BodyToValidateType,
  BodyValidatorCallbackType,
  HeadersToValidateType,
  ParamsToValidateType,
  ValidatorResponse
} from "../types/request.types"

import UserValidator from "./users.validator"

import InvalidRequestParamsError from "../errors/request/invalid-request-params.error"
import MissingRequestParamsError from "../errors/request/missing-request-params.error"
import IAuthenticationTokenDecoderService from "../services/users/authentication-token-decoder.interface"
import UnauthenticatedRequestError from "../errors/request/unauthenticated-request.error"
import { AuthenticationToken } from "../types/users.types"
import InvalidTokenError from "../errors/users/invalid-token.error"
import ExpiredTokenError from "../errors/users/expired-token.error"
import NoDecoderTokenServiceError from "../errors/validators/request/no-token-decoder-service.error"
import TokenWithInvalidUserIdError from "../errors/users/token-with-invalid-user-id.error"
import UserIdFromRequestTokenAndParamsAreNotMatchError from "../errors/request/user-id-from-request-token-and-params-are-not-match.error"
import MissingRequestBodyError from "../errors/request/missing-request-body.error"
import TaskValidator from "./tasks.validator"

export default class RequestValidator {
  public static getResponseForAuthenticationHeaders(
    headers: HeadersToValidateType,
    decoderService: IAuthenticationTokenDecoderService,
    paramsUserId?: string
  ): ValidatorResponse {
    if (headers === undefined || headers.authentication_token === undefined) {
      return { status: 401, body: UnauthenticatedRequestError.message }
    }
    if (typeof headers.authentication_token !== "string") {
      return { status: 400, body: InvalidTokenError.message }
    }
    if (decoderService === undefined) {
      return { status: 500, body: NoDecoderTokenServiceError.message }
    }
    let decodedToken: AuthenticationToken = undefined
    try {
      decodedToken = decoderService.execute(headers.authentication_token)
      const tokenValidationMessage = UserValidator.getMessageForUserId(decodedToken.userId)
      if (tokenValidationMessage !== null) {
        return { status: 400, body: TokenWithInvalidUserIdError.message }
      }
      if (paramsUserId !== undefined && paramsUserId !== decodedToken.userId) {
        return { status: 400, body: UserIdFromRequestTokenAndParamsAreNotMatchError.message }
      }
    } catch (err) {
      if (err instanceof ExpiredTokenError || err instanceof InvalidTokenError) {
        return { status: 400, body: err.message }
      }
      return { status: 500, body: err.message }
    }
    return null
  }

  public static getResponseForExistingBody(
    body: BodyToValidateType,
    validateCallback: BodyValidatorCallbackType
  ): ValidatorResponse {
    if (body === undefined) {
      return { status: 400, body: MissingRequestBodyError.message }
    }
    const validationMessage = validateCallback(body)
    if (validationMessage !== null) {
      return { status: 400, body: validationMessage }
    }
    return null
  }

  public static getResponseForParamsWithUserId(params: ParamsToValidateType): ValidatorResponse {
    if (params === undefined || params.userId === undefined) {
      return { status: 400, body: MissingRequestParamsError.message }
    }
    if (typeof params.userId !== "string") {
      return { status: 400, body: InvalidRequestParamsError.message }
    }
    const paramsValidationMessage = UserValidator.getMessageForUserId(params.userId)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: InvalidRequestParamsError.message }
    }
    return null
  }

  public static getResponseForParamsWithTaskId(params: ParamsToValidateType): ValidatorResponse {
    if (params === undefined || params.taskId === undefined) {
      return { status: 400, body: MissingRequestParamsError.message }
    }
    if (typeof params.taskId !== "string") {
      return { status: 400, body: InvalidRequestParamsError.message }
    }
    const paramsValidationMessage = TaskValidator.getMessageForTaskId(params.taskId)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: InvalidRequestParamsError.message }
    }
    return null
  }
}
