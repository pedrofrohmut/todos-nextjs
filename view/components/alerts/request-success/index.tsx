import { ReactElement } from "react"

import styles from "./styles.module.css"

const RequestSuccessAlert = ({ message }: { message: string }): ReactElement => (
  <div className={styles.container}>{message}</div>
)

export default RequestSuccessAlert
