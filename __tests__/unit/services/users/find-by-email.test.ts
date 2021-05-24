import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import { UserDatabaseType } from "../../../../server/types/users.types"
import FakeUserService from "../../../fakes/services/user.fake"

// Case 13
describe("[Service] Find user by e-mail", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 131
  test("Find a existing user by its e-mail address", async () => {
    // Setup
    const { name, email, passwordHash } = FakeUserService.getNew("131")
    await userDataAccess.create({ name, email, passwordHash })
    // Test
    let foundUser: UserDatabaseType = undefined
    let findErr: Error = undefined
    try {
      foundUser = await findUserByEmailService.execute(email)
    } catch (err) {
      findErr = err
    }
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(foundUser.name).toBe(name)
    expect(foundUser.email).toBe(email)
    expect(foundUser.passwordHash).toBe(passwordHash)
    // Clean Up
    await userDataAccess.deleteByEmail(email)
  })

  // 132
  test("Return null for a non-existing user", async () => {
    // Setup
    const { email } = FakeUserService.getNew("132")
    await deleteUserByEmailService.execute(email)
    // Test
    let foundUser: UserDatabaseType = undefined
    let findErr: Error = undefined
    try {
      foundUser = await findUserByEmailService.execute(email)
    } catch (err) {
      findErr = err
    }
    // Evaluation
    expect(findErr).not.toBeDefined()
    expect(foundUser).toBeNull()
  })
})
