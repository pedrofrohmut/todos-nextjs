import { ReactElement } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

type Props = {
  text?: string
}

const AddButton = ({ text = "Add" }: Props): ReactElement => {
  return (
    <a className={styles.container}>
      <FontAwesomeIcon icon={faPlus} />
      <span className={styles.text}>{text}</span>
    </a>
  )
}

export default AddButton
