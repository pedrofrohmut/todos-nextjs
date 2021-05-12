import { Connection } from "../../utils/connection-factory"
import UserDataAccess from "../../data-access/user"

type UserArgs = {
  name: string
  email: string
  passwordHash: string
}

const createUserService = async (
  connection: Connection,
  { name, email, passwordHash }: UserArgs
): Promise<void> => {
  try {
    new UserDataAccess(connection).create({ name, email, passwordHash })
  } catch (err) {
    throw new Error("[Service] Error to create an user: " + err.message)
  }
}

export default createUserService
