import { compare } from "bcryptjs"

const validatePasswordHashService = async (
  password?: string,
  passwordHash?: string
): Promise<boolean> => {
  if (passwordHash === undefined && passwordHash === "") return false
  const isMatch = await compare(password, passwordHash)
  return isMatch
}

export default validatePasswordHashService
