import { ReactElement, useState } from "react"
import Link from "next/link"

import TodoListItem, { TodoType } from "../../shared/components/todos/todo-list-item"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

// PLACAHOLDER  VALUES
const id = "1"
const name = "Routine"
const todos = [
  {
    id: "1",
    name: "Regar plantas",
    description: "Regar plantas até 4 vezes por semana, dependendo da quantidade de chuva",
    isComplete: true,
    taskId: "1"
  },
  {
    id: "2",
    name: "Lavar louça",
    description: "Lavar a louça usada no dia a noite antes de dormir",
    isComplete: false,
    taskId: "1"
  },
  {
    id: "3",
    name: "Limpat fogão",
    description: "Limpar o fogão duas vezes por semana",
    isComplete: false,
    taskId: "1"
  },
  {
    id: "4",
    name: "Trocar sacos de lixo",
    description: "Trocar os sacos de lixo quando ficaram cheios antes do lixeiro passar",
    isComplete: true,
    taskId: "1"
  }
]
const userId = "1"

const countIncomplete = (todos: TodoType[]): number =>
  todos.reduce((acc: number, curr: TodoType) => acc + (curr.isComplete ? 0 : 1), 0)

const TaskDetailsPage = (): ReactElement => {
  const [openTodoId, setOpenTodoId] = useState("")
  const incompleteTodosCount = countIncomplete(todos)

  const setIsOpen = (id: string): void => {
    if (id === openTodoId) {
      setOpenTodoId("")
    } else {
      setOpenTodoId(id)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Task Details</h1>
      <div className="task-details-container">
        <div className="details-header">
          <div className="task-name">{name}</div>
          <span className="incomplete-count">
            <span className="number">{incompleteTodosCount}</span>
            incomplete todos
          </span>
          <Link href="/task-list">
            <a className="button-add">Choose Task</a>
          </Link>
        </div>
        <div className="todo-list">
          {todos.map(todo => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              isOpen={todo.id === openTodoId}
              setIsOpen={setIsOpen}
            />
          ))}
        </div>
        <Link href="/add-todo">
          <a className="button-add">
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Todo</span>
          </a>
        </Link>
      </div>
      <div className="task-details-bottom-links">
        <a>Clean completed todos</a>
        <a>Delete current task</a>
      </div>
    </div>
  )
}

export default TaskDetailsPage
