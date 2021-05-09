import { ReactElement } from "react"
import Link from "next/link"

import EditButton from "../../buttons/edit"

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
            <EditButton />
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
