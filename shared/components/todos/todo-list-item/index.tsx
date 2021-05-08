import { ReactElement } from "react"
import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

export type TodoType = {
  id: string
  name: string
  description: string
  isComplete: boolean
  taskId: string
}

type Props = {
  todo: TodoType
  isOpen: boolean
  setIsOpen: (id: string) => void
  className: string
}

const TodoListItem = ({
  todo: { id, name, description, isComplete },
  isOpen,
  setIsOpen,
  className
}: Props): ReactElement => {
  return (
    <div className={className}>
      <div className={styles.header}>
        <input type="checkbox" checked={isComplete} />
        <a className={styles.name} onClick={(): void => setIsOpen(id)}>
          {name}
        </a>
        {isOpen && (
          <Link href={`/todos/edit/${id}`}>
            <a className="buttonEdit">
              <FontAwesomeIcon icon={faPencilAlt} />
              <span>Edit</span>
            </a>
          </Link>
        )}
      </div>
      {isOpen && (
        <div>
          <div className={styles.description}>{description}</div>
        </div>
      )}
    </div>
  )
}

export default TodoListItem
