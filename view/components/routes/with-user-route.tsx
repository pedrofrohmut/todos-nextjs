import AppContext from "../../context"
import HREFS from "../../constants/hrefs.enum"
import LoadingPage from "../loading/page"
import React, { ReactNode, useContext, useEffect, useState } from "react"
import isUserLoggedIn from "../../utils/is-user-logged-in.util"
import { useRouter } from "next/router"

const WithUserRoute = (Component: ReactNode): ReactNode => {
  // eslint-disable-next-line react/display-name
  return (): ReactNode => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
      const redirects = async (): Promise<boolean> => {
        if (state.user !== undefined) {
          setIsLoading(false)
          return
        }
        const isLoggedIn = await isUserLoggedIn(dispatch)
        if (!isLoggedIn) {
          return await router.push(HREFS.USERS_SIGNIN)
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

export default WithUserRoute
