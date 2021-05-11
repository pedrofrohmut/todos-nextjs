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
// import {
//   getValidationMessageForEmail,
//   getValidationMessageForName,
//   getValidationMessageForPassword
// } from "../../server/validation/user"
// import UserService from "../../server/services/user"

// export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
//   const { name, email, password } = req.body
//   const nameValidationMessage = getValidationMessageForName(name)
//   if (nameValidationMessage !== "") {
//     return res.status(400).send(nameValidationMessage)
//   }
//   const emailValidationMessage = getValidationMessageForEmail(email)
//   if (emailValidationMessage !== "") {
//     return res.status(400).send(emailValidationMessage)
//   }
//   const passwordValidationMessage = getValidationMessageForPassword(password)
//   if (passwordValidationMessage !== "") {
//     return res.status(400).send(passwordValidationMessage)
//   }
//   try {
//     const userService = new UserService()
//     await userService.create({ name, email, password })
//     return res.status(201).end()
//   } catch (err) {
//     return res.status(500).send("Error to create an user: " + err)
//   }
// }
