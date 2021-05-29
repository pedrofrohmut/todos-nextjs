import { NextApiRequest, NextApiResponse } from "next"

import ExpressAdapter from "../../../server/adapter/express.adapter"
import DeleteTaskWrapper from "../../../server/wrappers/tasks/delete-task.wrapper"
import FindTaskByIdWrapper from "../../../server/wrappers/tasks/find-task-by-id.wrapper"

const SignInRoute = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  switch (request.method) {
    case "GET":
      await new ExpressAdapter(request, response).callControllerWrapper(new FindTaskByIdWrapper())
      break
    case "DELETE":
      await new ExpressAdapter(request, response).callControllerWrapper(new DeleteTaskWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
