/* eslint-disable */
// EXECUTE BEFORE ALL TESTS - Setup

import env from "./test-env"
import { truncateDatabase } from "./utils"

process.env.PGUSER = env.PGUSER
process.env.PGHOST = env.PGHOST
process.env.PGPASSWORD = env.PGPASSWORD
process.env.PGDATABASE = env.PGDATABASE
process.env.PGPORT = env.PGPORT

export default async () => {
  console.log("")
  try {
    await truncateDatabase()
  } catch (err) {
    console.error("Error to setup jest: " + err.message)
  }
}
