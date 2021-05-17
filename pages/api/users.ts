import { NextApiRequest, NextApiResponse } from "next"
import ExpressAdapter from "../../server/adapter/express.adapter"

import CreateUserWrapper from "../../server/wrappers/users/create.wrapper"

const UsersRoute = (request: NextApiRequest, response: NextApiResponse): void => {
  switch (request.method) {
    case "POST": 
      new ExpressAdapter(request, response).callControllerWrapper(new CreateUserWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default UsersRoute
