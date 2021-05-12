import { Connection } from "../../utils/connection-factory"
import { UserType } from "../../types/user"
import UserDataAccess from "../../data-access/user"

const findUserByEmailService = async (connection: Connection, email: string): Promise<UserType> => {
  try {
    return new UserDataAccess(connection).findByEmail(email)
  } catch (err) {
    throw new Error("Error to find user by e-mail: " + err.message)
  }
}

export default findUserByEmailService
