import axios, { AxiosResponse } from "axios"
import { SignedUserType } from "../../server/types/users.types"
import { SERVER_URL } from "../constants"

export type ApiCallerResponse<T> = {
  status: number
  body: T
}

export type ApiCallerError = {
  status: number
  body: string
}

export type AuthHeaders = {
  authentication_token?: string
}

export default class ApiCaller {
  public static async getSignedUser(
    authHeaders: AuthHeaders
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
}
