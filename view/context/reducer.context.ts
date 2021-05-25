import ActionTypes from "./actions/action-types.enum"
import { StateType, ActionType } from "./types.context"

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return { ...state, user: action.payload.user }
    case ActionTypes.SIGNOUT:
      return { ...state, user: undefined }
    default:
      return state
  }
}

export default reducer
