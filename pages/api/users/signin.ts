import { NextApiRequest, NextApiResponse } from "next"
import ExpressAdapter from "../../../server/adapter/express.adapter"

import SignInController from "../../../server/controllers/users/implementations/signin.controller"

const SignInRoute = (request: NextApiRequest, response: NextApiResponse): void => {
  switch (request.method) {
    case "POST":
      new ExpressAdapter(request, response).callController(new SignInController())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
