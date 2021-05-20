import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/users.data-access"
import FakeUserService from "../../fakes/services/user.fake"

// Case 14
// 1 - create
// 2 - createAndReturn
// 3 - deleteByEmail
// 4 - deleteById
// 5 - findByEmail
// 6 - findById
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

  // 1
  test("Create", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("141")
    const foundUser = await userDataAccess.findByEmail(email)
    // Test
    await userDataAccess.create({ name, email, passwordHash })
    // Evaluation
    const createdUser = await userDataAccess.findByEmail(email)
    expect(foundUser).toBeNull()
    expect(createdUser.id).toBeDefined()
    expect(createdUser.name).toBeDefined()
    expect(createdUser.name).toBe(name)
    expect(createdUser.email).toBeDefined()
    expect(createdUser.email).toBe(email)
    expect(createdUser.passwordHash).toBeDefined()
    expect(createdUser.passwordHash).toBe(passwordHash)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 2
  test("Create and return", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("142")
    const foundUser = await userDataAccess.findByEmail(email)
    // Test
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Evaluation
    expect(foundUser).toBeNull()
    expect(createdUser.id).toBeDefined()
    expect(createdUser.name).toBeDefined()
    expect(createdUser.name).toBe(name)
    expect(createdUser.email).toBeDefined()
    expect(createdUser.email).toBe(email)
    expect(createdUser.passwordHash).toBeDefined()
    expect(createdUser.passwordHash).toBe(passwordHash)
  })

  // 3
  test("Delete by email", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("143")
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Test
    await userDataAccess.deleteByEmail(email)
    // Evaluation
    const deletedUser = await userDataAccess.findByEmail(email)
    expect(createdUser).not.toBeNull()
    expect(deletedUser).toBeNull()
  })

  // 4
  test("Delete by id", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("144")
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Test
    await userDataAccess.deleteById(createdUser.id)
    // Evaluation
    const deletedUser = await userDataAccess.findByEmail(email)
    expect(createdUser).not.toBeNull()
    expect(deletedUser).toBeNull()
  })

  // 5
  test("Find by email", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("145")
    // Test
    const findUserBeforeCreate = await userDataAccess.findByEmail(email)
    await userDataAccess.create({ name, email, passwordHash })
    const findUserAfterCreate = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(findUserBeforeCreate).toBeNull()
    expect(findUserAfterCreate).not.toBeNull()
  })

  // 6
  test("Find by email", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("146")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Test
    const foundUserBeforeDelete = await userDataAccess.findById(userId)
    await userDataAccess.deleteById(userId)
    const foundUserAfterDelete = await userDataAccess.findById(userId)
    // Evaluation
    expect(foundUserBeforeDelete).not.toBeNull()
    expect(foundUserAfterDelete).toBeNull()
  })
})
