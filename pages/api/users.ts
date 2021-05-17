import { NextApiRequest, NextApiResponse } from "next"
import ExpressAdapter from "../../server/adapter/express.adapter"

import CreateUserController from "../../server/controllers/users/implementations/create.controller"

const UsersRoute = (request: NextApiRequest, response: NextApiResponse): void => {
  switch (request.method) {
    case "POST":
      new ExpressAdapter(request, response).callController(new CreateUserController())
      break
    default:
      response.status(405).end()
  }
}

export default UsersRoute
