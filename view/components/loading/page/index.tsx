import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ReactElement } from "react"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

const LoadingPage = (): ReactElement => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </div>
  )
}

export default LoadingPage
