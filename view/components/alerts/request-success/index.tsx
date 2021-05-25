import { ReactElement } from "react"

import styles from "./styles.module.css"

const RequestSuccessAlert = ({ requestSuccess }: { requestSuccess: string }): ReactElement => (
  <div className={styles.container}>{requestSuccess}</div>
)

export default RequestSuccessAlert
