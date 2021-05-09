import { ReactElement } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

type Props = {
  text?: string
}

const EditButton = ({ text = "Edit" }: Props): ReactElement => {
  return (
    <a className={styles.container}>
      <FontAwesomeIcon icon={faPencilAlt} />
      <span className={styles.text}>{text}</span>
    </a>
  )
}

export default EditButton
