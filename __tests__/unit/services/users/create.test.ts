import ConnectionFactory from "../../../../server/utils/connection-factory"
import createUserService from "../../../../server/services/users/create"
import { hash } from "bcryptjs"
import UserDataAccess from "../../../../server/data-access/user"

// Case 12
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
    const userDataAccess = new UserDataAccess(conn)
    const passwordHash = await hash("1234", 8)
    const validCredentials = { name: "John Doe 121", email: "john_doe121@mail.com", passwordHash }
    const foundUser1 = await userDataAccess.findByEmail(validCredentials.email)
    // Test
    await createUserService(conn, validCredentials)
    // Evaluation
    const foundUser2 = await userDataAccess.findByEmail(validCredentials.email)
    expect(foundUser1).toBeNull()
    expect(foundUser2.name).toBe("John Doe 121")
    expect(foundUser2.email).toBe("john_doe121@mail.com")
    expect(foundUser2.passwordHash).toBe(passwordHash)
    // Clean Up
    await userDataAccess.deleteByEmail(validCredentials.email)
  })
})
