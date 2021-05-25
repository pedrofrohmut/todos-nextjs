export type ApiResponse<T> = {
  status: number
  body?: T
}

export type ApiError = {
  status: number
  body: string
}
