import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import ISignedController from "../../controllers/users/signed.interface"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import FindUserByIdService from "../../services/users/implementations/find-by-id.service"
import RequestValidator from "../../validators/request.validator"
import SignedController from "../../controllers/users/implementations/signed.controller"
import SignedUseCase from "../../use-cases/users/implementations/signed.use-case"
import UserDataAccess from "../../data-access/implementations/users.data-access"
import { SignedUserType } from "../../types/users.types"

export default class SignedWrapper implements IControllerWrapper<void, SignedUserType> {
  private connection: Connection
  private signedController: ISignedController
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const signedUseCase = new SignedUseCase(findUserByIdService, authenticationTokenDecoderService)
    this.signedController = new SignedController(signedUseCase)
    this.authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
  }

  private async cleanUp(): Promise<void> {
    await ConnectionFactory.closeConnection(this.connection)
  }

  public async execute(request: WrapperRequest<void>): Promise<WrapperResponse<SignedUserType>> {
    try {
      await this.init()
      const headersValidationResponse = RequestValidator.getResponseForAuthenticationHeaders(
        request.headers,
        this.authenticationTokenDecoderService
      )
      if (headersValidationResponse !== null) {
        return headersValidationResponse
      }
      const response = await this.signedController.execute({ headers: request.headers })
      return response
    } catch (err) {
      return { status: 500, body: "Error to get signed user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
