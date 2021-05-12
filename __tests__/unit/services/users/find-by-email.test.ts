import findUserByEmailService from "../../../../server/services/users/find-by-email"
import ConnectionFactory from "../../../../server/utils/connection-factory"

describe("[Service] Find user by e-mail", () => {
  const conn = ConnectionFactory.getConnection()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  test("Find a existing user by its e-mail address", async () => {
    // Setup
    await conn.query("INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)", [
      "John Doe 4",
      "john_doe4@mail.com",
      "1234"
    ])
    // Test
    const foundUser = await findUserByEmailService(conn, "john_doe4@mail.com")
    // Evaluation
    expect(foundUser.name).toBe("John Doe 4")
    expect(foundUser.email).toBe("john_doe4@mail.com")
    expect(foundUser.passwordHash).toBe("1234")
    // Clean Up
    await conn.query("DELETE FROM app.users WHERE email = $1", ["john_doe4@mail.com"])
  })
})
