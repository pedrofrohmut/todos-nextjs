import { NextApiRequest, NextApiResponse } from "next"

import CreateUserController from "../../server/controllers/users/create"

const UsersRoute = (request: NextApiRequest, response: NextApiResponse): void => {
  switch (request.method) {
    case "POST":
      new CreateUserController().execute(request, response)
      break
    default:
      response.status(405).end()
  }
}

export default UsersRoute
