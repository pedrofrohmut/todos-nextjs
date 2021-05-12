import { Client } from "pg"

import { DataBaseConnectionError } from "../errors/database"

export type Connection = Client

export default class ConnectionFactory {
  public static getConnection(): Connection {
    return new Client()
  }

  public static async connect(connection: Connection): Promise<boolean> {
    if (connection instanceof Client) {
      try {
        await connection.connect()
        return true
      } catch (err) {
        throw new DataBaseConnectionError(err.message)
      }
    }
    return false
  }
}
