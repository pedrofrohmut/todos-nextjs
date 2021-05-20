import { v4 as uuid } from "uuid"

import { UserType } from "../../../server/types/users.types"

export default class FakeUserService {
  public static getNew(code: string): UserType {
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
}
