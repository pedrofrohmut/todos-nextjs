import { Client } from "pg"

import { getValidationMessageForEmail } from "../../validation/user"
import { UserType } from "../../types/user"
import UserDataAccess from "../../data-access/user"

const findUserByEmailService = async (connection: Client, email?: string): Promise<UserType> => {
  const emailValidationMessage = getValidationMessageForEmail(email)
  if (emailValidationMessage)
    throw new Error("Cannot find user with invalid e-mail: " + emailValidationMessage)
  try {
    const foundUser = await new UserDataAccess(connection).findByEmail(email)
    return foundUser
  } catch (err) {
    throw new Error("Error to find user by e-mail: " + err)
  }
}

export default findUserByEmailService
