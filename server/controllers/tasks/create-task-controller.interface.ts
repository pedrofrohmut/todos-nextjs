import { CreateTaskType } from "../../types/task.types"
import { AuthenticationHeaders } from "../../types/user.types"

export type CreateTaskRequestType = {
  headers: AuthenticationHeaders
  body: CreateTaskType
  params: {
    userId: string
  }
}

export type CreateTaskResponseType = {
  status: 201 | 400
  body?: string
}

export default interface ICreateTaskController {
  execute: (request: CreateTaskRequestType) => Promise<CreateTaskResponseType>
}
