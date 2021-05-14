import UserDataAccess from "../../../../server/data-access/users/implementation"
import { EmailAlreadyInUseError } from "../../../../server/errors/users/email-already-in-use"
import CreateUserService from "../../../../server/services/users/create/implementation"
import DeleteUserByEmailService from "../../../../server/services/users/delete-by-email/implementation"
import FindUserByEmailService from "../../../../server/services/users/find-by-email/implementation"
import GeneratePasswordHashService from "../../../../server/services/users/generate-password-hash/implementation"
import CreateUserUseCase from "../../../../server/use-cases/users/create/implementation"
import ConnectionFactory from "../../../../server/utils/connection-factory"

// case 10
describe("[Use Case] Create User", () => {
  const conn = ConnectionFactory.getConnection()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  test("Must not create user with an e-mail already in use", async () => {
    const userDataAccess = new UserDataAccess(conn)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const findUserByEmailService = new FindUserByEmailService(userDataAccess)
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    const createUserUseCase = new CreateUserUseCase(findUserByEmailService, createUserService)
    const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)
    // Setup
    const email = "test@mail.com"
    await createUserService.execute({ name: "John Doe 101", email, password: "123456" })
    // Test and Evaluation
    try {
      await createUserUseCase.execute({ name: "John Doe 102", email, password: "123456" })
    } catch (err) {
      expect(err).not.toBe(null)
      expect(err instanceof EmailAlreadyInUseError).toBe(true)
    }
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })
})
