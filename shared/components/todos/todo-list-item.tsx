import { ReactElement } from "react"
import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"

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
}

const TodoListItem = ({
  todo: { id, name, description, isComplete },
  isOpen,
  setIsOpen
}: Props): ReactElement => {
  return (
    <div className="todo-container">
      <input type="checkbox" checked={isComplete} />
      <a className="name" onClick={(): void => setIsOpen(id)}>
        {name}
      </a>
      {isOpen && (
        <>
          <Link href={`/edit-todo/${id}`}>
            <a className="button-edit">
              <FontAwesomeIcon icon={faPencilAlt} />
              <span>Edit</span>
            </a>
          </Link>
          <div className="description">{description}</div>
        </>
      )}
    </div>
  )
}

export default TodoListItem
