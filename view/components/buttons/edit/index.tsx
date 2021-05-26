import { ReactElement } from "react"
import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

type Props = {
  text?: string
  href: string
}

const EditButton = ({ text = "Edit", href }: Props): ReactElement => {
  return (
    <Link href={href}>
      <a className={styles.container}>
        <FontAwesomeIcon icon={faPencilAlt} />
        <span className={styles.text}>{text}</span>
      </a>
    </Link>
  )
}

export default EditButton
