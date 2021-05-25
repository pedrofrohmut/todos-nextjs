import { ReactElement, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import HREFS from "../view/constants/hrefs.enum"
import isUserLoggedIn from "../view/utils/is-user-logged-in.util"

import styles from "./home/styles.module.css"
import AppContext from "../view/context"

const IndexPage = (): ReactElement => {
  const router = useRouter()
  const { dispatch } = useContext(AppContext)

  useEffect(() => {
    isUserLoggedIn(dispatch).then(isLoggedIn => {
      if (!isLoggedIn) {
        router.push(HREFS.USERS_SIGNIN)
      }
      router.push(HREFS.TASKS_LIST)
    })
  })

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </div>
  )
}

export default IndexPage
