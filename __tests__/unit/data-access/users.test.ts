import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/users.data-access"

// Case 14
describe("[Data Access] User", () => {
  // Dependencies
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 2
  test("Create user", async () => {
    // Setup
    const email = "john_doe142@mail.com"
    const userDataAccess = new UserDataAccess(conn)
    const foundUser1 = await userDataAccess.findByEmail(email)
    // Test
    await userDataAccess.create({ name: "John Doe 142", email, passwordHash: "password_hash142" })
    // Evaluation
    const foundUser2 = await userDataAccess.findByEmail(email)
    expect(foundUser1).toBeNull()
    expect(foundUser2.name).toBe("John Doe 142")
    expect(foundUser2.email).toBe("john_doe142@mail.com")
    expect(foundUser2.passwordHash).toBe("password_hash142")
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 3
  test("Delete user by e-mail", async () => {
    // Setup
    const email = "john_doe143@mail.com"
    await userDataAccess.create({ name: "John Doe 143", email, passwordHash: "password_hash143" })
    // Test
    await userDataAccess.deleteByEmail(email)
    // Evaluation
    const foundUser = await userDataAccess.findByEmail(email)
    expect(foundUser).toBeNull()
  })

  // 1
  test("Find user by e-mail", async () => {
    // Setup
    const email = "john_doe141@mail.com"
    const userDataAccess = new UserDataAccess(conn)
    await userDataAccess.create({ name: "John Doe 141", email, passwordHash: "password_hash141" })
    // Test
    const foundUser = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(foundUser).not.toBeNull()
    expect(foundUser.name).toBe("John Doe 141")
    expect(foundUser.email).toBe("john_doe141@mail.com")
    expect(foundUser.passwordHash).toBe("password_hash141")
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })
})
