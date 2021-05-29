import { AuthenticationHeaders } from "../../types/user.types"
import { CreateTaskType } from "../../types/task.types"
import { UserIdParamsType } from "../controller.types"

export type CreateTaskRequestType = {
  headers: AuthenticationHeaders
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
