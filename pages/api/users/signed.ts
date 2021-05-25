import { NextApiRequest, NextApiResponse } from "next"

import ExpressAdapter from "../../../server/adapter/express.adapter"
import SignedWrapper from "../../../server/wrappers/users/signed.wrapper"

const SignedRoute = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  switch (request.method) {
    case "GET":
      await new ExpressAdapter(request, response).callControllerWrapper(new SignedWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignedRoute
