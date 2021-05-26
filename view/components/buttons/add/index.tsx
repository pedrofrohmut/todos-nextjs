import { ReactElement } from "react"
import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

type Props = {
  text?: string
  href: string
}

const AddButton = ({ text = "Add", href }: Props): ReactElement => {
  return (
    <Link href={href}>
      <a className={styles.container}>
        <FontAwesomeIcon icon={faPlus} />
        <span className={styles.text}>{text}</span>
      </a>
    </Link>
  )
}

export default AddButton
