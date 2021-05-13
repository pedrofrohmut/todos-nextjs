import UserDataAccess from "../../../../server/data-access/user"
import findUserByEmailService from "../../../../server/services/users/find-by-email"
import ConnectionFactory from "../../../../server/utils/connection-factory"

// Case 13
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
    const email = "john_doe131@mail.com"
    const userDataAccess = new UserDataAccess(conn)
    await userDataAccess.create({ name: "John Doe 131", email, passwordHash: "1234" })
    // Test
    const foundUser = await findUserByEmailService(conn, email)
    // Evaluation
    expect(foundUser.name).toBe("John Doe 131")
    expect(foundUser.email).toBe("john_doe131@mail.com")
    expect(foundUser.passwordHash).toBe("1234")
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })
})
