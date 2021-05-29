import { NextApiRequest, NextApiResponse } from "next"

import ExpressAdapter from "../../../../server/adapter/express.adapter"
import CreateTaskWrapper from "../../../../server/wrappers/tasks/create-task.wrapper"
import FindTasksByUserIdWrapper from "../../../../server/wrappers/tasks/find-tasks-by-user-id.wrapper"

const SignInRoute = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  switch (request.method) {
    case "GET":
      await new ExpressAdapter(request, response).callControllerWrapper(new FindTasksByUserIdWrapper())
      break
    case "POST":
      await new ExpressAdapter(request, response).callControllerWrapper(new CreateTaskWrapper())
      break
    default:
      response.status(405).end()
  }
}

export default SignInRoute
