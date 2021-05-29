import { SignedUserType } from "../../types/user.types"

export default interface IGetSignedUserUseCase {
  execute: (token: string) => Promise<SignedUserType>
}
