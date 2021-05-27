import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ISignedController from "../../controllers/users/signed.interface"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import FindUserByIdService from "../../services/users/implementations/find-by-id.service"
import SignedController from "../../controllers/users/implementations/signed.controller"
import SignedUseCase from "../../use-cases/users/implementations/signed.use-case"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import { SignedUserType } from "../../types/users.types"

import UnauthenticatedRequestError from "../../errors/request/unauthenticated-request.error"

export default class SignedWrapper implements IControllerWrapper<void, SignedUserType> {
  private connection: Connection
  private signedController: ISignedController

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const signedUseCase = new SignedUseCase(findUserByIdService, authenticationTokenDecoderService)
    this.signedController = new SignedController(signedUseCase)
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<SignedUserType>> {
    const { headers } = request
    if (headers === undefined || headers.authentication_token === undefined) {
      return { status: 401, body: UnauthenticatedRequestError.message }
    }
    try {
      await this.init()
      const response = await this.signedController.execute({ headers })
      return response
    } catch (err) {
      return { status: 500, body: "Error to get signed user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
