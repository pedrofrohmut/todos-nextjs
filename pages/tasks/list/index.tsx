import { ReactElement, useContext, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import AddButton from "../../../view/components/buttons/add"
import AppContext from "../../../view/context"
import HREFS from "../../../view/constants/hrefs.enum"
import TaskListItem, { TaskType } from "../../../view/components/tasks/task-list-item"
import isUserLoggedIn from "../../../view/utils/is-user-logged-in.util"

const PLACAHOLDER_TASKS: TaskType[] = [
  { id: "1", name: "Routine", description: "", userId: "1" },
  { id: "2", name: "Supermarket", description: "", userId: "1" },
  { id: "3", name: "Pets", description: "", userId: "1" },
  { id: "4", name: "Cars", description: "", userId: "1" },
  { id: "5", name: "Bills", description: "", userId: "1" },
  { id: "6", name: "Bank", description: "", userId: "1" }
]

const TaskListPage = (): ReactElement => {
  const router = useRouter()
  const { dispatch } = useContext(AppContext)

  useEffect(() => {
    isUserLoggedIn(dispatch).then(isLoggedIn => {
      if (!isLoggedIn) {
        router.push(HREFS.USERS_SIGNIN)
      }
    })
  })

  return (
    <div className="pageContainer">
      <div className="pageTitle">Tasks</div>
      <div className="list">
        {PLACAHOLDER_TASKS.map((task: TaskType) => (
          <TaskListItem className="listItem" key={task.id} task={task} />
        ))}
      </div>
      <Link href="/task/add">
        <AddButton />
      </Link>
    </div>
  )
}

export default TaskListPage
