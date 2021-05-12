import { Connection } from "../../utils/connection-factory"
import UserDataAccess from "../../data-access/user"

const deleteUserByEmailService = async (connection: Connection, email: string): Promise<void> => {
  try {
    await new UserDataAccess(connection).deleteByEmail(email)
  } catch (err) {
    throw new Error("[Service] Error to delete user by e-mail: " + err.message)
  }
}

export default deleteUserByEmailService
