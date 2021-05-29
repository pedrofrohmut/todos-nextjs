import ConnectionFactory from "../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../server/data-access/implementations/user.data-access"
import FakeUserService from "../../fakes/services/user.fake"
import { UserDatabaseType } from "../../../server/types/user.types"

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
    let createErr: Error = undefined
    try {
      await userDataAccess.create({ name, email, passwordHash })
    } catch (err) {
      createErr = err
    }
    // Setup 2
    const createdUser = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(createErr).not.toBeDefined()
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
    let createErr: Error = undefined
    let createdUser: UserDatabaseType = undefined
    try {
      createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    } catch (err) {
      createErr = err
    }
    // Evaluation
    expect(createErr).not.toBeDefined()
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
    let deleteErr: Error = undefined
    try {
      await userDataAccess.deleteByEmail(email)
    } catch (err) {
      deleteErr = err
    }
    // Setup 2
    const deletedUser = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(deleteErr).not.toBeDefined()
    expect(createdUser).not.toBeNull()
    expect(deletedUser).toBeNull()
  })

  // 4
  test("Delete by id", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("144")
    const createdUser = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Test
    let deleteErr: Error = undefined
    try {
      await userDataAccess.deleteById(createdUser.id)
    } catch (err) {
      deleteErr = err
    }
    // Setup 2
    const foundUserAfterDelete = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(deleteErr).not.toBeDefined()
    expect(createdUser).not.toBeNull()
    expect(foundUserAfterDelete).toBeNull()
  })

  // 5
  test("Find by email", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("145")
    const findUserBeforeCreate = await userDataAccess.findByEmail(email)
    // Test
    let findErr: Error = undefined
    try {
      await userDataAccess.create({ name, email, passwordHash })
    } catch (err) {
      findErr = err
    }
    // Setup 2
    const findUserAfterCreate = await userDataAccess.findByEmail(email)
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(findUserBeforeCreate).toBeNull()
    expect(findUserAfterCreate).not.toBeNull()
  })

  // 6
  test("Find by email", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("146")
    const { id: userId } = await userDataAccess.createAndReturn({ name, email, passwordHash })
    const foundUserBeforeDelete = await userDataAccess.findById(userId)
    // Test
    let findErr: Error = undefined
    try {
      await userDataAccess.deleteById(userId)
    } catch (err) {
      findErr = err
    }
    // Setup 2
    const foundUserAfterDelete = await userDataAccess.findById(userId)
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(foundUserBeforeDelete).not.toBeNull()
    expect(foundUserAfterDelete).toBeNull()
  })
})
