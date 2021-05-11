import UserDataAccess from "../../../server/data-access/user"
import ConnectionFactory from "../../../server/utils/connection-factory"

const conn = ConnectionFactory.getConnection()

describe("USER DATA ACCESS", () => {
  beforeAll(async () => {
    await conn.connect()
  })

  test("Find user by e-mail", async () => {
    // Setup - Create user to be found
    const result = await conn.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      ["John Doe 1", "john_doe1@mail.com", "password_hash1"]
    )
    // Test
    const userDataAccess = new UserDataAccess(conn)
    const foundUser = await userDataAccess.findByEmail("john_doe1@mail.com")
    // Expectations
    expect(result.rows[0].id).toBe(foundUser.id)
    expect(foundUser.name).toBe("John Doe 1")
    expect(foundUser.email).toBe("john_doe1@mail.com")
    expect(foundUser.passwordHash).toBe("password_hash1")
    // Clean Up
    await conn.query("DELETE FROM app.users WHERE email = $1", ["john_doe1@mail.com"])
  })

  test("Create user", async () => {
    // Setup
    const foundUser1 = await conn.query("SELECT * FROM app.users WHERE email = $1", [
      "john_doe2@mail.com"
    ])
    // Test
    const userDataAccess = new UserDataAccess(conn)
    await userDataAccess.create({
      name: "John Doe 2",
      email: "john_doe2@mail.com",
      passwordHash: "password_hash2"
    })
    // Evaluation
    const foundUser2 = await conn.query("SELECT * FROM app.users WHERE email = $1", [
      "john_doe2@mail.com"
    ])
    expect(foundUser1.rows.length).toBe(0)
    expect(foundUser2.rows[0].name).toBe("John Doe 2")
    expect(foundUser2.rows[0].email).toBe("john_doe2@mail.com")
    expect(foundUser2.rows[0].password_hash).toBe("password_hash2")
    // Clean Up
    await conn.query("DELETE FROM app.users WHERE email = $1", ["john_doe2@mail.com"])
  })
})
