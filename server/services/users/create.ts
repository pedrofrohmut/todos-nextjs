import { Client } from "pg"

import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../validation/user"
import UserDataAccess from "../../data-access/user"
import validatePasswordHashService from "./validate-password-hash"

type Args = {
  name?: string
  email?: string
  password?: string
  passwordHash?: string
}

const createUserService = async (
  connection: Client,
  { name, email, password, passwordHash }: Args
): Promise<void> => {
  const nameValidationMessage = getValidationMessageForName(name)
  if (nameValidationMessage) {
    throw new Error("Cannot create a user with invalid user name: " + nameValidationMessage)
  }
  const emailValidationMessage = getValidationMessageForEmail(email)
  if (emailValidationMessage) {
    throw new Error("Cannot create a user with invalid e-mail address: " + emailValidationMessage)
  }
  const passwordValidationMessage = getValidationMessageForPassword(password)
  if (passwordValidationMessage) {
    throw new Error("Cannot create a user with invalid password: " + passwordValidationMessage)
  }
  const isValidPasswordHash = await validatePasswordHashService(password, passwordHash)
  if (!isValidPasswordHash) {
    throw new Error("Cannot create an user with invalid password hash")
  }
  try {
    await new UserDataAccess(connection).create({ name, email, passwordHash })
  } catch (err) {
    throw new Error("Error to create a user: " + err)
  }
}

export default createUserService
