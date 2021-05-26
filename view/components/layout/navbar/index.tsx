import {ReactElement, useContext, useState} from "react"
import {useRouter} from "next/router"
import Link from "next/link"

import AppContext from "../../../context"
import signOutAction from "../../../context/actions/users/signout.action"
import HREFS from "../../../constants/hrefs.enum"

import styles from "./styles.module.css"
import RequestSuccessAlert from "../../alerts/request-success"

const Navbar = (): ReactElement => {
  const router = useRouter()
  const {state, dispatch} = useContext(AppContext)

  const [signOutMessage, setSignOutMessage] = useState("")

  const handleSignOut = (): void => {
    setSignOutMessage(`Bye ${state.user.name}. You signed out with success.`)
    // setTimeout(() => {
    //   signOutAction(dispatch)
    //   router.push(HREFS.USERS_SIGNIN)
    //   setSignOutMessage("")
    // }, 2100)
  }

  if (!state || !state.user || !state.user.name) {
    return ( 
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <nav className={styles.nav}>
            <ul>
              <li>
                <Link href={HREFS.USERS_SIGNIN}>
                  <a className="navLink">Sign In</a>
                </Link>
              </li>
              <li>
                <Link href={HREFS.USERS_SIGNUP}>
                  <a className="navLink">Sign Up</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div>
      <pre>{JSON.stringify(state, null, 4)}</pre>
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <span className={styles.userName}>Welcome {state.user.name}</span>
          <nav className={styles.nav}>
            <li>
              <Link href={HREFS.HOME}>
                <a className="navLink">Home</a>
              </Link>
            </li>
            <li>
              <a onClick={handleSignOut} className={styles.signOutButton}>Sign Out</a>
            </li>
          </nav>
        </div>
      </div>
      {signOutMessage !== "" && (
      <div className={styles.signOutMessage}>
          <RequestSuccessAlert message={signOutMessage} />
        </div>
      )}
    </div>
  )
}

export default Navbar
