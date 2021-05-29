import { compare } from "bcryptjs"

import ICheckPasswordService from "../check-password-service.interface"

export default class CheckPasswordService implements ICheckPasswordService {
  public async execute(password: string, passwordHash: string): Promise<boolean> {
    try {
      const isMatch = await compare(password, passwordHash)
      return isMatch
    } catch (err) {
      throw new Error("[Service] Error to check password: " + err.message)
    }
  }
}
