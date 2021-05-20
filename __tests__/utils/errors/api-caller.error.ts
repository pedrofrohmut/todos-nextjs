export default class ApiCallerError extends Error {
  public readonly status: number
  public readonly body: string

  constructor(status: number, body: string) {
    super()
    this.status = status
    this.body = body
  }
}
