import IAuthenticationTokenDecoderService from "../../services/users/authentication-token-decoder-service.interface"
import IControllerWrapper, {
  WrapperRequest,
  WrapperResponse
} from "../controller-wrapper.interface"
import IGetSignedUserController from "../../controllers/users/get-signed-user-controller.interface"

import AuthenticationTokenDecoderService from "../../services/users/implementations/authentication-token-decoder.service"
import ConnectionFactory, { Connection } from "../../utils/connection-factory.util"
import FindUserByIdService from "../../services/users/implementations/find-user-by-id.service"
import GetSignedUserController from "../../controllers/users/implementations/get-signed-user.controller"
import GetSignedUserUseCase from "../../use-cases/users/implementations/get-signed-user.use-case"
import RequestValidator from "../../validators/request.validator"
import UserDataAccess from "../../data-access/implementations/user.data-access"
import { SignedUserType } from "../../types/user.types"

export default class GetSignedUserWrapper implements IControllerWrapper<void, SignedUserType> {
  private connection: Connection
  private getSignedUserController: IGetSignedUserController
  private authenticationTokenDecoderService: IAuthenticationTokenDecoderService

  constructor() {}

  private async init(): Promise<void> {
    this.connection = ConnectionFactory.getConnection()
    await ConnectionFactory.connect(this.connection)
    const userDataAccess = new UserDataAccess(this.connection)
    const findUserByIdService = new FindUserByIdService(userDataAccess)
    const authenticationTokenDecoderService = new AuthenticationTokenDecoderService()
    const signedUseCase = new GetSignedUserUseCase(findUserByIdService, authenticationTokenDecoderService)
    this.getSignedUserController = new GetSignedUserController(signedUseCase)
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
      const response = await this.getSignedUserController.execute({ headers: request.headers })
      return response
    } catch (err) {
      return { status: 500, body: "[Wrapper] Error to get signed user: " + err.message }
    } finally {
      await this.cleanUp()
    }
  }
}
