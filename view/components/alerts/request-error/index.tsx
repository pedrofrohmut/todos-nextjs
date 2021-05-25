import { ReactElement } from "react"

import styles from "./styles.module.css"

const RequestErrorAlert = ({ requestErr }: { requestErr: string }): ReactElement => (
  <div className={styles.container}>{requestErr}</div>
)

export default RequestErrorAlert
