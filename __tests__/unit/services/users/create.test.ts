import ConnectionFactory from "../../../../server/utils/connection-factory"
import UserDataAccess from "../../../../server/data-access/users/implementation"
import CreateUserService from "../../../../server/services/users/create/implementation"
import GeneratePasswordHashService from "../../../../server/services/users/generate-password-hash/implementation"
import {compare} from "bcryptjs"

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
    const userDataAccess = new UserDataAccess(conn)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    // Setup
    const validCredentials = { name: "John Doe 121", email: "john_doe121@mail.com", password: "password121" }
    const foundUser1 = await userDataAccess.findByEmail(validCredentials.email)
    // Test
    await createUserService.execute(validCredentials)
    // Evaluation
    const foundUser2 = await userDataAccess.findByEmail(validCredentials.email)
    expect(foundUser1).toBeNull()
    expect(foundUser2.name).toBe("John Doe 121")
    expect(foundUser2.email).toBe("john_doe121@mail.com")
    expect(await compare(validCredentials.password, foundUser2.passwordHash)).toBe(true)
    // Clean Up
    await userDataAccess.deleteByEmail(validCredentials.email)
  })
})
