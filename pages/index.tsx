import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ReactNode } from "react"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import WithHomeRoute from "../view/components/routes/with-home-route"

import styles from "./home/styles.module.css"

const IndexPage = (): ReactNode => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </div>
  )
}

export default WithHomeRoute(IndexPage)
