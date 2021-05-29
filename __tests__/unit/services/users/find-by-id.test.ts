import UserDataAccess from "../../../../server/data-access/implementations/user.data-access"
import FindUserByIdService from "../../../../server/services/users/implementations/find-user-by-id.service"
import { UserDatabaseType } from "../../../../server/types/user.types"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 22
describe("[Service] Find user by id", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const findUserByIdService = new FindUserByIdService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("return a UserDatabaseType when the user is registered", async () => {
    const { name, email, passwordHash } = FakeUserService.getNew("221")
    const created = await userDataAccess.createAndReturn({ name, email, passwordHash })
    // Test
    let foundUser: UserDatabaseType = undefined
    let findErr: Error = undefined
    try {
      foundUser = await findUserByIdService.execute(created.id)
    } catch (err) {
      findErr = err
    }
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(foundUser).not.toBeNull()
    expect(foundUser.id).toBe(created.id)
    expect(foundUser.name).toBe(name)
    expect(foundUser.email).toBe(email)
    expect(foundUser.passwordHash).toBe(passwordHash)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 2
  test("returns null when the user is not registered", async () => {
    const { name, email, passwordHash } = FakeUserService.getNew("222")
    const created = await userDataAccess.createAndReturn({ name, email, passwordHash })
    await userDataAccess.deleteByEmail(email)
    // Test
    let foundUser: UserDatabaseType = undefined
    let findErr: Error = undefined
    try {
      foundUser = await findUserByIdService.execute(created.id)
    } catch (err) {
      findErr = err
    }
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(foundUser).toBeNull()
  })
})
