import { AuthenticationHeaders } from "../types/user.types"

export type WrapperResponse<T> = {
  status: number
  body?: T | string
}

export type RequestParamsType = { userId: string } & { taskId: string } & { todoId: string }

export type WrapperRequest<T> = {
  headers?: AuthenticationHeaders
  params?: RequestParamsType
  body?: T
}

export default interface IControllerWrapper<T, U> {
  execute: (request: WrapperRequest<T>) => Promise<WrapperResponse<U>>
}
