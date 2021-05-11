import { hash } from "bcryptjs"

import { getValidationMessageForPassword } from "../../validation/user"

const generatePasswordHashService = async (password?: string): Promise<string> => {
  const passwordValidationMessage = getValidationMessageForPassword(password)
  if (passwordValidationMessage !== "") {
    throw new Error(
      "Cannot generate password hash with invalid password: " + passwordValidationMessage
    )
  }
  try {
    const passwordHash = await hash(password, 8)
    return passwordHash
  } catch (err) {
    throw new Error("Error to generate password hash: " + err)
  }
}

export default generatePasswordHashService
