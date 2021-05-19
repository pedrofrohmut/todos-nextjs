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

export type AuthenticationToken = {
  userId: string,
  exp: number
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
