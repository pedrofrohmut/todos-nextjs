import { ReactElement } from "react"

import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./styles.module.css"

type Props = {
  text?: string
  isSubmitting: boolean
  isDisabled: boolean
}

const SubmitButton = ({ text = "Submit", isSubmitting, isDisabled }: Props): ReactElement => {
  if (isSubmitting) {
    return (
      <button type="submit" className={styles.submitting} disabled={true}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <span className={styles.text}>{text}</span>
      </button>
    )
  }
  return (
    <button
      type="submit"
      className={isDisabled ? styles.disabled : styles.container}
      disabled={isDisabled}
    >
      <FontAwesomeIcon icon={faPaperPlane} />
      <span className={styles.text}>{text}</span>
    </button>
  )
}

export default SubmitButton
