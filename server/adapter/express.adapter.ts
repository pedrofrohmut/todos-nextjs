import { NextApiRequest, NextApiResponse } from "next"

export default class ExpressAdapter {
  private request: NextApiRequest
  private response: NextApiResponse

  constructor(request: NextApiRequest, response: NextApiResponse) {
    this.request = request
    this.response = response
  }

  // eslint-disable-next-line
  public async callController(controller: any): Promise<void> {
    const { status, body } = await controller.execute(this.request)
    if (body) {
      this.response.status(status).send(body)
    } else {
      this.response.status(status).end()
    }
  }
}
