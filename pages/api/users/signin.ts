import { NextApiRequest, NextApiResponse } from "next"

import ExpressAdapter from "../../../server/adapter/express.adapter"
import SignInWrapper from "../../../server/wrappers/users/signin.wrapper"

const SignInRoute = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  switch (request.method) {
    case "POST":
      await new ExpressAdapter(request, response).callControllerWrapper(new SignInWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
