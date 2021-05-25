import LocalStorageNames from "../../../constants/local-stora-name.enum"
import { DispatchType, SignInPayloadType } from "../../types.context"
import ActionTypes from "../action-types.enum"

const signInAction = (dispatch: DispatchType, payload: SignInPayloadType): void => {
  localStorage.setItem(LocalStorageNames.TOKEN, payload.user.token)
  dispatch({ type: ActionTypes.SIGNIN, payload })
}

export default signInAction
