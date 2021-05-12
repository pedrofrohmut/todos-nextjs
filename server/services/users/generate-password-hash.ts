import { hash } from "bcryptjs"

const generatePasswordHashService = async (password: string): Promise<string> => {
  try {
    const passwordHash = await hash(password, 8)
    return passwordHash
  } catch (err) {
    throw new Error("Error to generate password hash: " + err.message)
  }
}

export default generatePasswordHashService
