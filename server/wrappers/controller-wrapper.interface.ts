import { RequestParamsType } from "../types/request.types"
import { AuthenticationHeadersType } from "../types/user.types"

export type WrapperResponse<T> = {
  status: number
  body?: T | string
}

export type WrapperRequest<T> = {
  headers?: AuthenticationHeadersType
  params?: RequestParamsType
  body?: T
}

export default interface IControllerWrapper<T, U> {
  execute: (request: WrapperRequest<T>) => Promise<WrapperResponse<U>>
}
