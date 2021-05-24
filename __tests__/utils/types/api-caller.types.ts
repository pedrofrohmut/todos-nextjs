export type ApiCallerResponse<T> = {
  status: number
  body?: T
}

export type ApiCallerError = {
  status: number
  body: string
}
