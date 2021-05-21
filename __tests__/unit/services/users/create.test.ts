import { compare } from "bcryptjs"

import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import FakeUserService from "../../../fakes/services/user.fake"

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
    const { name, email, password } = FakeUserService.getNew("121")
    const foundUser1 = await userDataAccess.findByEmail(email)
    // Test
    let createErr: Error = undefined
    try {
      await createUserService.execute({ name, email, password })
    } catch (err) {
      createErr = err
    }
    // Setup 2
    const foundUser2 = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(createErr).not.toBeDefined()
    expect(foundUser1).toBeNull()
    expect(foundUser2.name).toBe(name)
    expect(foundUser2.email).toBe(email)
    expect(await compare(password, foundUser2.passwordHash)).toBe(true)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })
})
