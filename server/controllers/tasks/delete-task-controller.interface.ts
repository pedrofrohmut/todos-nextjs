import { AuthenticationHeaders } from "../../types/user.types"
import { TaskIdParamsType } from "../controller.types"

export type DeleteTaskRequestType = {
  headers: AuthenticationHeaders
  params: TaskIdParamsType
}

export type DeleteTaskResponseType = {
  status: 400 | 204
  body?: string
}

export default interface IDeleteTaskController {
  execute: (request: DeleteTaskRequestType) => Promise<DeleteTaskResponseType>
}
