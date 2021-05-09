import { ReactElement } from "react"

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./styles.module.css"

type Props = {
  text?: string
}

const SubmitButton = ({ text = "Submit" }: Props): ReactElement => {
  return (
    <button type="submit" className={styles.container}>
      <FontAwesomeIcon icon={faPaperPlane} />
      <span className={styles.text}>{text}</span>
    </button>
  )
}

export default SubmitButton
