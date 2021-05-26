import AppContext from "../../context"
import HREFS from "../../constants/hrefs.enum"
import LoadingPage from "../loading/page"
import isUserLoggedIn from "../../utils/is-user-logged-in.util"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"

const WithGuestRoute = (Component: ReactNode): ReactNode => {
  // eslint-disable-next-line react/display-name
  return (): ReactNode => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
      const redirects = async (): Promise<boolean> => {
        if (state.user !== undefined) {
          return await router.push(HREFS.TASKS_LIST)
        }
        const isLoggedIn: boolean = await isUserLoggedIn(dispatch)
        if (isLoggedIn) {
          return await router.push(HREFS.TASKS_LIST)
        }
        setIsLoading(false)
      }
      redirects()
    }, [state.user])

    if (isLoading) {
      return <LoadingPage />
    }
    // @ts-ignore
    return <Component />
  }
}

export default WithGuestRoute
