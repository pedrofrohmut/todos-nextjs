import UsersApi from "../api/users.api"
import LocalStorageNames from "../constants/local-stora-name.enum"
import signInAction from "../context/actions/users/signin.action"
import {DispatchType} from "../context/types.context"

const isUserLoggedIn = async (dispatch: DispatchType): Promise<boolean> => {
  const token = localStorage.getItem(LocalStorageNames.TOKEN)
  if (!token) {
    console.log("NO TOKEN. redirecting...")
    return false
  }
  try {
    const response = await UsersApi.getSignedUser({ authentication_token: token })
    const { id, name, email } = response.body
    const payload = {
      user: {
        id,
        name,
        email,
        token
      }
    }
    signInAction(dispatch, payload)
    console.log("SIGNED WITH SUCCESS. redirecting...")
    return true
  } catch (err) {
    console.log("TOKEN ERROR. redirecting...")
    localStorage.removeItem(LocalStorageNames.TOKEN)
    return false
  }
}

export default isUserLoggedIn
