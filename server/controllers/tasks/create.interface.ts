import { CreateTaskType } from "../../types/tasks.types"
import { AuthenticationHeaders } from "../../types/users.types"

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
