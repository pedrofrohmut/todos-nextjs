import { AuthenticationHeadersType } from "../../types/user.types"
import { TaskType } from "../../types/task.types"
import { UserIdParamsType } from "../../types/request.types"

export type FindTasksByUserIdRequestType = {
  headers: AuthenticationHeadersType
  params: UserIdParamsType
}

export type FindTasksByUserIdResponseType = {
  status: 200 | 400
  body: string | TaskType[]
}

export default interface IFindTasksByUserIdController {
  execute: (request: FindTasksByUserIdRequestType) => Promise<FindTasksByUserIdResponseType>
}
