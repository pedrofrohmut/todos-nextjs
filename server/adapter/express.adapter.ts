import { NextApiRequest, NextApiResponse } from "next"
import IControllerWrapper, { RequestParamsType } from "../wrappers/controller-wrapper.interface"

export default class ExpressAdapter {
  private readonly request: NextApiRequest
  private readonly response: NextApiResponse

  constructor(request: NextApiRequest, response: NextApiResponse) {
    this.request = request
    this.response = response
  }

  public async callControllerWrapper(
    // eslint-disable-next-line
    controllerWrapper: IControllerWrapper<any, any>
  ): Promise<void> {
    const params = this.request.query as RequestParamsType
    const headers = { authentication_token: this.request.headers.authentication_token as string }
    const { status, body } = await controllerWrapper.execute({
      params,
      body: this.request.body,
      headers
    })
    if (body) {
      this.response.status(status).send(body)
    } else {
      this.response.status(status).end()
    }
  }
}
