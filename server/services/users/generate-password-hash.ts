import { hash } from "bcryptjs"

const generatePasswordHashService = async (password: string): Promise<string> => {
  try {
    return hash(password, 8)
  } catch (err) {
    throw new Error("Error to generate password hash: " + err.message)
  }
}

export default generatePasswordHashService
