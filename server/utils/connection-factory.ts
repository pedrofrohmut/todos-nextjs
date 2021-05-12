import { Client } from "pg"

import { DataBaseConnectionError } from "../errors/database"

export type Connection = Client

export default class ConnectionFactory {
  public static getConnection(): Connection {
    return new Client()
  }

  public static async connect(connection: Connection): Promise<void> {
    if (connection instanceof Client) {
      try {
        await connection.connect()
      } catch (err) {
        throw new DataBaseConnectionError(err.message)
      }
    }
  }

  public static async closeConnection(connection: Connection): Promise<void> {
    if (connection instanceof Client) {
      try {
        await connection.end()
      } catch (err) {
        throw new DataBaseConnectionError(err.message)
      }
    }
  }
}
