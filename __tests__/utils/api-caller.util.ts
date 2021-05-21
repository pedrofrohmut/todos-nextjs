import axios, { AxiosResponse } from "axios"
import {
  AuthenticationHeaders,
  CreateUserType,
  SignedUserType,
  SignInCredentialsType,
  SignInDataType
} from "../../server/types/users.types"
import { SERVER_URL } from "../constants"

export type ApiCallerResponse<T> = {
  status: number
  body?: T
}

export type ApiCallerError = {
  status: number
  body: string
}

export default class ApiCaller {
  public static async getSignedUser(
    authHeaders: AuthenticationHeaders
  ): Promise<ApiCallerResponse<SignedUserType>> {
    let response: AxiosResponse
    try {
      response = await axios.get(SERVER_URL + "/api/users/signed", {
        method: "GET",
        headers: authHeaders
      })
    } catch (err) {
      if (
        err.response &&
        typeof err.response.status === "number" &&
        typeof err.response.data === "string"
      ) {
        throw {
          status: err.response.status,
          body: err.response.data
        } as ApiCallerError
      }
      throw err
    }
    return {
      status: response.status,
      body: response.data
    }
  }

  public static async createUser({
    name,
    email,
    password
  }: CreateUserType): Promise<ApiCallerResponse<void>> {
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
  }: SignInCredentialsType): Promise<ApiCallerResponse<SignInDataType>> {
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
