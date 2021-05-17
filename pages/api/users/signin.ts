import { NextApiRequest, NextApiResponse } from "next"
import ExpressAdapter from "../../../server/adapter/express.adapter"

import SignInWrapper from "../../../server/wrappers/users/signin.wrapper"

const SignInRoute = (request: NextApiRequest, response: NextApiResponse): void => {
  switch (request.method) {
    case "POST":
      new ExpressAdapter(request, response).callControllerWrapper(new SignInWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
