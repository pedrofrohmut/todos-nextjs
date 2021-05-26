import { ReactElement, useContext, useEffect, useState } from "react"
import Link from "next/link"

import TodoListItem, { TodoType } from "../../../view/components/todos/todo-list-item"

import AddButton from "../../../view/components/buttons/add"

import styles from "./styles.module.css"
import AppContext from "../../../view/context"
import { useRouter } from "next/router"
import isUserLoggedIn from "../../../view/utils/is-user-logged-in.util"
import HREFS from "../../../view/constants/hrefs.enum"

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
  const router = useRouter()
  const { state, dispatch } = useContext(AppContext)

  const [openTodoId, setOpenTodoId] = useState("")
  const incompleteTodosCount = countIncomplete(todos)

  useEffect(() => {
    if (state.user === undefined) {
      isUserLoggedIn(dispatch).then(isLoggedIn => {
        if (!isLoggedIn) {
          router.push(HREFS.USERS_SIGNIN)
        }
      })
    }
  }, [state.user])

  const setIsOpen = (id: string): void => {
    if (id === openTodoId) {
      setOpenTodoId("")
    } else {
      setOpenTodoId(id)
    }
  }

  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Task Details</h1>
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        <span className={styles.incomplete}>
          <span className={styles.incompleteNumber}>{incompleteTodosCount}</span>
          incomplete todos
        </span>
        <Link href="/tasks/list">
          <a className="nav-link">Choose Task</a>
        </Link>
      </div>
      <div className="list">
        {todos.map(todo => (
          <TodoListItem
            className="listItem"
            key={todo.id}
            todo={todo}
            isOpen={todo.id === openTodoId}
            setIsOpen={setIsOpen}
          />
        ))}
      </div>
      <Link href="/todos/add">
        <AddButton />
      </Link>
      <div className={styles.links}>
        <a className="nav-link">Clean completed todos</a>
        <a className="nav-link">Delete current task</a>
      </div>
    </div>
  )
}

export default TaskDetailsPage
