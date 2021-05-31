import { AuthenticationHeadersType } from "../../types/user.types"
import { CreateTaskType } from "../../types/task.types"
import { UserIdParamsType } from "../../types/request.types"

export type CreateTaskRequestType = {
  headers: AuthenticationHeadersType
  body: CreateTaskType
  params: UserIdParamsType
}

export type CreateTaskResponseType = {
  status: 201 | 400
  body?: string
}

export default interface ICreateTaskController {
  execute: (request: CreateTaskRequestType) => Promise<CreateTaskResponseType>
}
