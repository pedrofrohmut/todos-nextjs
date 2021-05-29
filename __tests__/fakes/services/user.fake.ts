import { compare } from "bcryptjs"
import { v4 as uuid } from "uuid"

import User from "../../../server/entities/user.entity"

export default class FakeUserService {
  public static getNew(code: string): User {
    return {
      id: uuid(),
      name: `John Doe ${code}`,
      email: `john_doe${code}@mail.com`,
      password: `password${code}`,
      passwordHash: `password_hash${code}`
    }
  }

  public static getInvalidUserId(): string {
    return "___INVALID_USER_ID__"
  }

  public static async comparePasswordAndHash(password: string, hash: string): Promise<boolean> {
    const isMatch = await compare(password, hash)
    return isMatch
  }
}
