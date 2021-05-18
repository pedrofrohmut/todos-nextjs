import { Client } from "pg"

import DataBaseConnectionError from "../errors/database/connection.error"

export type Connection = Client

export type ConnectionParamsType = {
  user: string
  host: string
  database: string
  password: string
  port: number
}

export default class ConnectionFactory {
  public static getConnection(connectionParams?: ConnectionParamsType): Connection {
    let connection = null
    try {
      if (connectionParams) {
        connection = new Client(connectionParams)
      } else {
        connection = new Client()
      }
    } catch (err) {
      throw new DataBaseConnectionError(err.message)
    }
    return connection
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
