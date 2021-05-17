export type RequestBody = {
  email: string
  password: string
}

export type Request = {
  body: RequestBody
}

export type ResponseBody =
  | {
      user: {
        id: string
        name: string
        email: string
      }
      token: string
    }
  | string

export type Response = {
  status: number
  body: ResponseBody
}

export default interface ISignInController {
  execute: (request: Request) => Promise<Response>
}
