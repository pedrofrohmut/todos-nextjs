import { AuthenticationHeaders } from "../../types/user.types"
import { TaskIdParamsType } from "../controller.types"
import { TaskType } from "../../types/task.types"

export type FindTaskByIdRequestType = {
  headers: AuthenticationHeaders
  params: TaskIdParamsType
}

export type FindTaskByIdResponseType = {
  status: 200 | 400
  body: string | TaskType
}

export default interface IFindTaskByIdController {
  execute: (request: FindTaskByIdRequestType) => Promise<FindTaskByIdResponseType>
}
