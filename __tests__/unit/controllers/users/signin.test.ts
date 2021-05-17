import axios from "axios"

import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import CreateUserService from "../../../../server/services/users/implementations/create.service"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"
import GeneratePasswordHashService from "../../../../server/services/users/implementations/generate-password-hash.service"

import { SERVER_URL } from "../../../constants"

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

  test("Return status ok with valid credentials", async () => {
    const userDataAccess = new UserDataAccess(conn)
    const generatePasswordHashService = new GeneratePasswordHashService()
    const createUserService = new CreateUserService(generatePasswordHashService, userDataAccess)
    // Setup
    const email = "john_doe171@mail.com"
    const password = "password171"
    await createUserService.execute({ name: "John Doe 171", email, password })
    // Test
    const response = await axios.post(URL, { email, password })
    // Evaluation
    expect(response.status).toBe(200)
    expect(response.data.token).toBeDefined()
    // Clean Up
    await new DeleteUserByEmailService(userDataAccess).execute(email)
  })
})
