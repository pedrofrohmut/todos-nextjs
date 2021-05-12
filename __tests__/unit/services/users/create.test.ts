import ConnectionFactory from "../../../../server/utils/connection-factory"
import createUserService from "../../../../server/services/users/create"
import { hash } from "bcryptjs"

describe("[Service] Create User Service", () => {
  const conn = ConnectionFactory.getConnection()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  test("Create a user with valid credentials", async () => {
    // Setup
    const foundUser1 = await conn.query("SELECT * FROM app.users WHERE email = $1", [
      "john_doe3@mail.com"
    ])
    const passwordHash = await hash("1234", 8)
    // Test
    await createUserService(conn, {
      name: "John Doe 3",
      email: "john_doe3@mail.com",
      passwordHash
    })
    // Evaluation
    const foundUser2 = await conn.query("SELECT * FROM app.users WHERE email = $1", [
      "john_doe3@mail.com"
    ])
    expect(foundUser1.rows.length).toBe(0)
    expect(foundUser2.rows[0].name).toBe("John Doe 3")
    expect(foundUser2.rows[0].email).toBe("john_doe3@mail.com")
    expect(foundUser2.rows[0].password_hash).toBe(passwordHash)
    // Clean Up
    await conn.query("DELETE FROM app.users WHERE email = $1", ["john_doe3@mail.com"])
  })
})
