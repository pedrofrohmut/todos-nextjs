import { ReactElement } from "react"

import styles from "./styles.module.css"

const RequestErrorAlert = ({ message }: { message: string }): ReactElement => (
  <div className={styles.container}>{message}</div>
)

export default RequestErrorAlert
