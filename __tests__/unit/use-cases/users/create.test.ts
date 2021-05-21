import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"
import CreateUserUseCase from "../../../../server/use-cases/users/implementations/create.use-case"
import EmailAlreadyInUseError from "../../../../server/errors/users/email-already-in-use.error"
import FakeUserService from "../../../fakes/services/user.fake"

// case 10
describe("[Use Case] Create User", () => {
  const conn = ConnectionFactory.getConnection()
  const userDataAccess = new UserDataAccess(conn)
  const generatePasswordHashService = new GeneratePasswordHashService()
  const findUserByEmailService = new FindUserByEmailService(userDataAccess)
  const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
  const createUserUseCase = new CreateUserUseCase(findUserByEmailService, createUserService)
  const deleteUserByEmailService = new DeleteUserByEmailService(userDataAccess)

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
  })

  // 1
  test("Must not create user with an e-mail already in use", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("101A")
    const { name: otherName, password: otherPassword } = FakeUserService.getNew("101B")
    await createUserService.execute({ name, email, password })
    // Test and Evaluation
    let useCaseErr: Error = undefined
    try {
      await createUserUseCase.execute({ name: otherName, email, password: otherPassword })
    } catch (err) {
      useCaseErr = err
    }
    // Evaluation
    expect(useCaseErr).toBeDefined()
    expect(useCaseErr.message).toBe(EmailAlreadyInUseError.message)
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })

  // 2
  test("Create an user with valid credentials an e-mail not registered", async () => {
    // Setup
    const { name, email, password } = FakeUserService.getNew("102")
    // Test
    let useCaseErr: Error = undefined
    try {
    await createUserService.execute({ name, email, password })
    } catch (err) {
      useCaseErr = err
    }
    // Evaluation
    const foundUser = await findUserByEmailService.execute(email)
    expect(useCaseErr).not.toBeDefined()
    expect(foundUser).not.toBeNull()
    expect(foundUser.id).toBeDefined()
    expect(foundUser.name).toBe(name)
    expect(foundUser.email).toBe(email)
    expect(foundUser.passwordHash).toBeDefined()
    // Clean Up
    await deleteUserByEmailService.execute(email)
  })
})
