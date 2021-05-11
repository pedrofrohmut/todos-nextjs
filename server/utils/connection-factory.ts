import { Client } from "pg"

export default class ConnectionFactory {
  public static getConnection(): Client {
    return new Client()
  }
}
