import {AuthenticationHeaders} from "../types/users.types"

export type WrapperResponse<T> = {
  status: number
  body?: T | string
}

export type Params = { userId: string } & { taskId: string } & { todoId: string }

export type WrapperRequest<T> = {
  headers?: AuthenticationHeaders
  params?: Params
  body?: T
}

export default interface IControllerWrapper<T, U> {
  execute: (request: WrapperRequest<T>) => Promise<WrapperResponse<U>>
}
