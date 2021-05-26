import { ReactNode, useContext, useEffect } from "react"
import { useRouter } from "next/router"

import AppContext from "../../context"
import HREFS from "../../constants/hrefs.enum"
import isUserLoggedIn from "../../utils/is-user-logged-in.util"

const WithHomeRoute = (Component: ReactNode): ReactNode => {
  // eslint-disable-next-line react/display-name
  return (): ReactNode => {
    const router = useRouter()
    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
      const redirects = async (): Promise<boolean> => {
        if (state.user !== undefined) {
          return await router.push(HREFS.TASKS_LIST)
        }
        const isLoggedIn = await isUserLoggedIn(dispatch)
        if (!isLoggedIn) {
          return await router.push(HREFS.USERS_SIGNIN)
        }
        return await router.push(HREFS.TASKS_LIST)
      }
      redirects()
    }, [state.user])

    // @ts-ignore
    return <Component />
  }
}

export default WithHomeRoute
