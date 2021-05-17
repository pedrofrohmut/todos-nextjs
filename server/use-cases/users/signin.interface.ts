export type CredentialsType = {
  email: string
  password: string
}

export type SignInDataType = {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
}

export default interface ISignInUseCase {
  execute: (credentials: CredentialsType) => Promise<SignInDataType>
}
