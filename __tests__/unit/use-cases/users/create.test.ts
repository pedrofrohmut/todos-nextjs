import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import CreateUserUseCase from "../../../../server/use-cases/users/implementations/create.use-case"
import { EmailAlreadyInUseError } from "../../../../server/errors/users/email-already-in-use.error"

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
