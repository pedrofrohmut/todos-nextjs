import IControllerWrapper from "../controller-wrapper.interface"
import ISignedController, { Request, Response } from "../../controllers/users/signed.interface"
import SignedController from "../../controllers/users/implementations/signed.controller"
import SignedUseCase from "../../use-cases/users/implementations/signed.use-case"
import FindUserByIdService from "../../services/users/implementations/find-by-id.service"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"

export default class SignedWrapper implements IControllerWrapper {
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

  public async execute(request: Request): Promise<Response> {
    // TODO: use a filter for authToken
    if (!request.headers || !request.headers.authentication_token) {
      return { status: 401, body: `Missing the authentication token. Please add the header: ["authentication_token": "<your_authentication_token>"] to your request` }
    }
    try {
      await this.init()
      const response = await this.signedController.execute(request)
      return response
    } catch (err) {
      return { status: 500, body: "Error to get signed user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}