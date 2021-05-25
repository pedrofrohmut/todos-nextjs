import axios from "axios"

import {
  AuthenticationHeaders,
  CreateUserType,
  SignedUserType,
  SignInCredentialsType,
  SignInDataType
} from "../../server/types/users.types"
import { ApiResponse } from "./api.types"

import { SERVER_URL } from "./constants"

export default class UsersApi {
  public static async getSignedUser(
    headers: AuthenticationHeaders
  ): Promise<ApiResponse<SignedUserType>> {
    try {
      const response = await axios.get(SERVER_URL + "/api/users/signed", { headers })
      return {
        status: response.status,
        body: response.data
      }
    } catch (err) {
      if (
        err.response &&
        typeof err.response.status === "number" &&
        typeof err.response.data === "string"
      ) {
        throw {
          status: err.response.status,
          body: err.response.data
        }
      }
      throw err
    }
  }

  public static async createUser({
    name,
    email,
    password
  }: CreateUserType): Promise<ApiResponse<void>> {
    try {
      const response = await axios.post(SERVER_URL + "/api/users", { name, email, password })
      return {
        status: response.status
      }
    } catch (err) {
      throw {
        status: err.response.status,
        body: err.response.data
      }
    }
  }

  public static async signinUser({
    email,
    password
  }: SignInCredentialsType): Promise<ApiResponse<SignInDataType>> {
    try {
      const response = await axios.post(SERVER_URL + "/api/users/signin", { email, password })
      return {
        status: response.status,
        body: response.data
      }
    } catch (err) {
      throw {
        status: err.response.status,
        body: err.response.data
      }
    }
  }
}
