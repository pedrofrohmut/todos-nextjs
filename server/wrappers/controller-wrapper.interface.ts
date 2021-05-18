export type WrapperResponse = {
  status: number
  body?: unknown
}

export default interface IControllerWrapper {
  // eslint-disable-next-line
  execute: (request: any) => Promise<WrapperResponse>
}
