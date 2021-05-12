import { NextApiRequest, NextApiResponse } from "next"

import { CreateUserType } from "../../types/user"
import CreateUserUseCase from "../../use-cases/users/create"
import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../validation/user"
import { EmailAlreadyInUseError } from "../../errors/user"

export default class CreateUserController {
  private validateBody({ name, email, password }: CreateUserType): string {
    const nameValidationMessage = getValidationMessageForName(name)
    if (nameValidationMessage) {
      return nameValidationMessage
    }
    const emailValidationMessage = getValidationMessageForEmail(email)
    if (emailValidationMessage) {
      return emailValidationMessage
    }
    const passwordValidationMessage = getValidationMessageForPassword(password)
    if (passwordValidationMessage) {
      return passwordValidationMessage
    }
    return null
  }

  public async execute(request: NextApiRequest, response: NextApiResponse): Promise<void> {
    const validationMessage = this.validateBody(request.body)
    if (validationMessage) {
      response.status(400).send(validationMessage)
    }
    const { name, email, password } = request.body
    try {
      await new CreateUserUseCase().execute({ name, email, password })
      response.status(201).end()
    } catch (err) {
      if (err instanceof EmailAlreadyInUseError) {
        response.status(400).send(EmailAlreadyInUseError.message)
      }
      response.status(500).send("Error to create an user: " + err.message)
    }
  }
}
