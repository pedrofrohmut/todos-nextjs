import axios from "axios"

import { SERVER_URL } from "../../../constants"
import ConnectionFactory from "../../../../server/utils/connection-factory.util"
import UserDataAccess from "../../../../server/data-access/implementations/users.data-access"
import DeleteUserByEmailService from "../../../../server/services/users/implementations/delete-by-email.service"

const URL = SERVER_URL + "/api/users"

// Case 11
describe("[Controller] Create User", () => {
  const conn = ConnectionFactory.getConnection()

  beforeAll(async () => {
    await ConnectionFactory.connect(conn)
  })

  afterAll(async () => {
    await ConnectionFactory.closeConnection(conn)
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

  test("Return created when valid", async () => {
    // Setup
    const email = "john_doe111@mail.com"
    // Test
    const response = await axios.post(URL, { name: "John Doe 111", email, password: "password111" })
    // Evaluation
    expect(response.status).toBe(201)
    // Clean Up
    await new DeleteUserByEmailService(new UserDataAccess(conn)).execute(email)
  })
})
