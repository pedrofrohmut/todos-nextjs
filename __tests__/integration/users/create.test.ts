// import axios from "axios"

// import { SERVER_URL } from "../../constants"
// import createUserService from "../../../server/services/users/create"

// const URL = SERVER_URL + "/api/users"

// describe("Testing route POST api/users", () => {
//   test("Route exists", async () => {
//     try {
//       await axios.post(URL, {})
//     } catch (err) {
//       expect(err.response.status).not.toBe(404)
//     }
//   })

//   test("Validate user name, value validation only", async () => {
//     // undefined
//     try {
//       await axios.post(URL, { email: "john@doe.com", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // blank
//     try {
//       await axios.post(URL, { name: "", email: "john@doe.com", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // too short
//     try {
//       await axios.post(URL, { name: "j", email: "john@doe.com", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // too long
//     try {
//       await axios.post(URL, {
//         name:
//           "uahsduasudahudadsahsdkjasdkjasjdjasdkjahdkjhaskjdhkajsdkjahsdkjakjsdhakjshdkjahsdkjaskjdhakjshdkajhsdkjahsasjdajsdiasjdiajsdaijdaid",
//         email: "john@doe.com",
//         password: "1234"
//       })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//   })

//   test("Validate user email, value validation only", async () => {
//     // undefined
//     try {
//       await axios.post(URL, { name: "John Doe", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // blank
//     try {
//       await axios.post(URL, { name: "John Doe", email: "", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // isEmail (pattern match)
//     try {
//       await axios.post(URL, { name: "John Doe", email: "john_doe", password: "1234" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//   })

//   test("Validate user password, value validatio only", async () => {
//     // undefined
//     try {
//       await axios.post(URL, { name: "John Doe", email: "john@doe.com" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // blank
//     try {
//       await axios.post(URL, { name: "John Doe", email: "john@doe.com", password: "" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // too short
//     try {
//       await axios.post(URL, { name: "John Doe", email: "john@doe.com", password: "12" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     // too long
//     try {
//       await axios.post(URL, {
//         name: "John Doe",
//         email: "john@doe.com",
//         password: "1234@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
//       })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//   })

//   test("Status 400, for e-mail in use", async () => {
//     await UserService.create({ name: "John Doe", email: "john@doe.com", password: "1234" })
//     try {
//       await axios.post(URL, { name: "John Smith Dor", email: "john@doe.com", password: "smith123" })
//     } catch (err) {
//       expect(err.response.status).toBe(400)
//     }
//     const user1 = await UserService.findByEmail("john@doe.com")
//     await UserService.delete(user1.id)
//   })

//   // test("With valid credentials. User is created")
// })
