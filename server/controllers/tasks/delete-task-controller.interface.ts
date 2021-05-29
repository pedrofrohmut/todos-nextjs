import { AuthenticationHeaders } from "../../types/user.types"

export type DeleteTaskRequestType = {
  headers: AuthenticationHeaders
  params: {
    taskId: string
  }
}

export type DeleteTaskResponseType = {
  status: 400 | 204
  body?: string
}

export default interface IDeleteTaskController {
  execute: (request: DeleteTaskRequestType) => Promise<DeleteTaskResponseType>
}
