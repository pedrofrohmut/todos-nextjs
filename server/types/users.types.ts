export type UserType = {
  id?: string
  name?: string
  email?: string
  password?: string
  passwordHash?: string
}

export type CreateUserType = {
  name: string
  email: string
  password: string
}

export type SignedUserType = {
  id: string
  name: string
  email: string
}

export type SignInCredentialsType = {
  email: string
  password: string
}

export type SignInDataType = {
  user: SignedUserType
  token: AuthenticationToken
}

export type AuthenticationToken = {
  userId: string
  exp: number
}

export type AuthenticationHeaders = {
  authentication_token?: string
}

export type UserDatabaseType = {
  id: string
  name: string
  email: string
  passwordHash: string
}

export type CreateUserDatabaseType = {
  name: string
  email: string
  passwordHash: string
}
