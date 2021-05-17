export type RequestBody = {
  name?: string
  email?: string
  password?: string
}

export type Request = {
  body: RequestBody
}

export type Response = {
  status: number
  body?: string
}

export default interface ICreateUserController {
  execute: (request: Request) => Promise<Response>
}
