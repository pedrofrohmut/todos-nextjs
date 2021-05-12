import { Connection } from "../../utils/connection-factory"
import { UserType } from "../../types/user"
import UserDataAccess from "../../data-access/user"

const findUserByEmailService = async (connection: Connection, email: string): Promise<UserType> => {
  try {
    const foundUser = await new UserDataAccess(connection).findByEmail(email)
    return foundUser
  } catch (err) {
    throw new Error("Error to find user by e-mail: " + err.message)
  }
}

export default findUserByEmailService
