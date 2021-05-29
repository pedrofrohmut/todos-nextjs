import { ReactElement } from "react"
import Link from "next/link"

import styles from "./styles.module.css"

const ApiHomePage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1>Api Routes</h1>
      <table className={styles.table}>
        <tr>
          <td>
            <h2>Users</h2>
          </td>
        </tr>
        <tr>
          <td>
            <ul>
              <li>
                <Link href="/docs/users/create-user">
                  <a className="navLink">Create User</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/users/signin">
                  <a className="navLink">Sign In</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/users/get-signed-user">
                  <a className="navLink">Get Signed User</a>
                </Link>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            <h2>Tasks</h2>
          </td>
        </tr>
        <tr>
          <td>
            <ul>
              <li>
                <Link href="/docs/tasks/create-task">
                  <a className="navLink">Create Task</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/tasks/delete-task">
                  <a className="navLink">Delete Task</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/tasks/find-task-by-id">
                  <a className="navLink">Find Task By Id</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/tasks/find-task-by-user-id">
                  <a className="navLink">Find Task By User Id</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/tasks/update-task">
                  <a className="navLink">Update Task</a>
                </Link>
              </li>
            </ul>
          </td>
        </tr>

        <tr>
          <td>
            <h2>Todos</h2>
          </td>
        </tr>
        <tr>
          <td>
            <ul>
              <li>
                <Link href="/docs/todos/clear-done-todos-by-task-id">
                  <a className="navLink">Clear Done Todos By Task Id</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/create-todo">
                  <a className="navLink">Create Todo</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/delete-todo">
                  <a className="navLink">Delete Todo</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/find-todo-by-id">
                  <a className="navLink">Find Todo By Id</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/find-todos-by-task-id">
                  <a className="navLink">Find Todos By Task Id</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/set-todo-as-done">
                  <a className="navLink">Set Todo As Done</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/set-todo-as-not-done">
                  <a className="navLink">Set Todo As Not Done</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos/update-todo">
                  <a className="navLink">Upgrade Todo</a>
                </Link>
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
  )
}

export default ApiHomePage
