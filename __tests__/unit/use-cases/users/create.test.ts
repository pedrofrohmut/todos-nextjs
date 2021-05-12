import { EmailAlreadyInUseError } from "../../../../server/errors/user"
import ConnectionFactory from "../../../../server/utils/connection-factory"
import createUserService from "../../../../server/services/users/create"
import deleteUserByEmailService from "../../../../server/services/users/delete-by-email"
import CreateUserUseCase from "../../../../server/use-cases/users/create"

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
    const email = "test@mail.com"
    // Setup
    await createUserService(conn, { name: "John Doe 101", email, passwordHash: "123456" })
    // Test and Evaluation
    try {
      await new CreateUserUseCase().execute({ name: "John Doe 102", email, password: "123456" })
    } catch (err) {
      expect(err).not.toBe(null)
      expect(err instanceof EmailAlreadyInUseError).toBe(true)
    }
    // expect(
    //   new CreateUserUseCase().execute({ name: "John Doe 102", email, password: "123456" })
    // ).toThrowError()
    
    // Clean Up
    await deleteUserByEmailService(conn, email)
  })
})
