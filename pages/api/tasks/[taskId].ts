import { NextApiRequest, NextApiResponse } from "next"

import ExpressAdapter from "../../../server/adapter/express.adapter"
import DeleteTaskWrapper from "../../../server/wrappers/tasks/delete-task.wrapper"

const SignInRoute = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  switch (request.method) {
    case "DELETE":
      await new ExpressAdapter(request, response).callControllerWrapper(new DeleteTaskWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
