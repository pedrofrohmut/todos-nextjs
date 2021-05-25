import LocalStorageNames from "../../../constants/local-stora-name.enum"
import { DispatchType } from "../../types.context"
import ActionTypes from "../action-types.enum"

const signOutAction = (dispatch: DispatchType): void => {
  localStorage.removeItem(LocalStorageNames.TOKEN)
  dispatch({ type: ActionTypes.SIGNOUT })
}

export default signOutAction
