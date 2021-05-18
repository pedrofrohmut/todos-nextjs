import { compare } from "bcryptjs"

import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"

// Case 12
describe("[Service] Create User Service", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  test("Create a user with valid credentials", async () => {
    // Setup
    const validCredentials = {
      name: "John Doe 121",
      email: "john_doe121@mail.com",
      password: "password121"
    }
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
