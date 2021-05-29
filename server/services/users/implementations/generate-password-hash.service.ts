import { hash } from "bcryptjs"

import IGeneratePasswordHashService from "../generate-password-hash-service.interface"

export default class GeneratePasswordHashService implements IGeneratePasswordHashService {
  public async execute(password: string): Promise<string> {
    try {
      const passwordHash = await hash(password, 8)
      return passwordHash
    } catch (err) {
      throw new Error("Error to generate password hash: " + err.message)
    }
  }
}
