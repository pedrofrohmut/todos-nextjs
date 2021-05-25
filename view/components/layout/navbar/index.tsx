import {ReactElement, useContext, useState} from "react"
import {useRouter} from "next/router"
import Link from "next/link"

import AppContext from "../../../context"
import signOutAction from "../../../context/actions/users/signout.action"
import HREFS from "../../../constants/hrefs.enum"

import styles from "./styles.module.css"

const Navbar = (): ReactElement => {
  const router = useRouter()
  const {state, dispatch} = useContext(AppContext)

  const [signOutMessage, setSignOutMessage] = useState("")

  const handleSignOut = (): void => {
    signOutAction(dispatch)
    setSignOutMessage(`Bye ${state.user.name}. You signed out with success.`)
    router.push(HREFS.USERS_SIGNIN)
    setTimeout(() => {
      setSignOutMessage("")
    }, 1800)
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
    <>        
      <pre>{JSON.stringify(state, null, 4)}</pre>
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <span className={styles.userName}>Welcome {state.user.name}</span>
          <nav className={styles.nav}>
            <li>
              <Link href={HREFS.TASKS_LIST}>
                <a className="navLink">Tasks List</a>
              </Link>
            </li>
            <li>
              <a onClick={handleSignOut} className={styles.signOutButton}>Sign Out</a>
            </li>
          </nav>
        </div>
      </div>
      {signOutMessage !== "" && (
        <div className="pageContainer" style={{padding: "2rem"}}>
          <div className="success">{signOutMessage}</div>
        </div>
      )}
    </>
  )
}

export default Navbar
