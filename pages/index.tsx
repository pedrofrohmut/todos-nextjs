import { ReactElement } from "react"

// import { Client } from "pg"

const IndexPage = (): ReactElement => {
  return <h1>Hello from NextJS</h1>
}

// export const getStaticProps = async (): Promise<{ props: unknown }> => {
//   let client = null
//   try {
//     client = new Client()
//     await client.connect()
//     console.log("[DATABASE_CONNECTION] Connected to database successfully")
//   } catch (err) {
//     console.error("[DATABASE_CONNECTION] Error to connect to database", err)
//   }
//   if (client) {
//     try {
//       await client.query("SELECT NOW()")
//       await client.end()
//       console.log("[DATABASE_QUERY] Query the database successfully")
//     } catch (err) {
//       console.error("[DATABASE_QUERY] Error to query database", err)
//     }
//   }
//   console.log(`[NODE_ENV] Node env is: ${process.env.NODE_ENV}`)
//   return {
//     props: {}
//   }
// }

export default IndexPage
