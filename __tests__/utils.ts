import ConnectionFactory from "../server/utils/connection-factory.util"
import env from "./test-env"

export const truncateDatabase = async (): Promise<void> => {
  try {
    const conn = ConnectionFactory.getConnection({
      user: env.PGUSER,
      password: env.PGPASSWORD,
      database: env.PGDATABASE,
      host: env.PGHOST,
      port: parseInt(env.PGPORT)
    })
    await ConnectionFactory.connect(conn)
    await conn.query("DELETE FROM app.users")
    await ConnectionFactory.closeConnection(conn)
    console.log("\nDatabase Truncated\n")
  } catch (err) {
    console.error("Error to truncate database: " + err.message)
  }
}
