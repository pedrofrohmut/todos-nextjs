export type StateType = {
  user?: {
    id: string
    name: string
    email: string
    token: string
  }
}

export type SignInPayloadType = {
  user: {
    id: string
    name: string
    email: string
    token: string
  }
}

export type ActionType = { type: "SIGNIN", payload: SignInPayloadType } | { type: "SIGNOUT" }

export type DispatchType = (action: ActionType) => void

export type AppContextType = {
  state: StateType
  dispatch: DispatchType
}
