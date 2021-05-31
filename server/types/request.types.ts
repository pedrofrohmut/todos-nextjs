export type BodyValidatorCallbackType = (body: BodyToValidateType) => string | null

// eslint-disable-next-line
export type BodyToValidateType = any

export type HeadersToValidateType =
  | undefined
  | {
      authentication_token?: string | string[]
    }

export type ParamsToValidateType =
  | undefined
  | {
      userId?: string | string[]
      taskId?: string | string[]
      todoId?: string | string[]
    }

export type RequestParamsType = { userId: string } & { taskId: string } & { todoId: string }

export type TaskIdParamsType = {
  taskId: string
}

export type TodoIdParamsType = {
  todoId: string
}

export type UserIdParamsType = {
  userId: string
}

export type ValidatorResponse = null | {
  status: number
  body: string
}
