import axios from "axios"

import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"

import { SERVER_URL } from "../../../constants"
import FindUserByEmailService from "../../../../server/services/users/implementations/find-by-email.service"

const URL = SERVER_URL + "/api/users/signin"

// Case 17
describe("[Controller] SignIn User", () => {
  const conn = ConnectionFactory.getConnection()

  beforeAll(async () => {
    ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    ConnectionFactory.closeConnection(conn)
  })

  test("Can be found by route", async () => {
    try {
      // Test
      await axios.post(URL, {})
    } catch (err) {
      // Evaluation
      expect(err.response.status).not.toBe(404)
    }
  })

  test("Return bad request with invalid body", async () => {
    try {
      // Test
      await axios.post(URL, {})
    } catch (err) {
      // Evaluation
      expect(err.response.status).toBe(400)
    }
  })

  test("Return status ok with valid credentials", async () => {
    const userDataAccess = new UserDataAccess(conn)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    const findUserByEmailService = new FindUserByEmailService(userDataAccess)
    // Setup
    const name = "John Doe 171"
    const email = "john_doe171@mail.com"
    const password = "password171"
    await createUserService.execute({ name, email, password })
    const createdUser = await findUserByEmailService.execute(email)
    // Test
    const response = await axios.post(URL, { email, password })
    // Evaluation
    expect(response.status).toBe(200)
    expect(response.data.user.id).toBe(createdUser.id)
    expect(response.data.user.name).toBe(name)
    expect(response.data.user.email).toBe(email)
    expect(response.data.token).toBeDefined()
    // Clean Up
    await new DeleteUserByEmailService(userDataAccess).execute(email)
  })
})
