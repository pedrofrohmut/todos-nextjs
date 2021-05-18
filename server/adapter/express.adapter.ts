import { NextApiRequest, NextApiResponse } from "next"
import IControllerWrapper from "../wrappers/controller-wrapper.interface"

export default class ExpressAdapter {
  private readonly request: NextApiRequest
  private readonly response: NextApiResponse

  constructor(request: NextApiRequest, response: NextApiResponse) {
    this.request = request
    this.response = response
  }

  // eslint-disable-next-line
  public async callControllerWrapper(controllerWrapper: IControllerWrapper): Promise<void> {
    const { status, body } = await controllerWrapper.execute(this.request)
    if (body) {
      this.response.status(status).send(body)
    } else {
      this.response.status(status).end()
    }
  }
}
