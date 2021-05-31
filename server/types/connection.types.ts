import { Client } from "pg"

export type Connection = Client

export type ConnectionParamsType = {
  user: string
  host: string
  database: string
  password: string
  port: number
}
