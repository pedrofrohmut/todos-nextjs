import { ReactElement } from "react"

import AddButton from "../../../view/components/buttons/add"
import TaskListItem, { TaskType } from "../../../view/components/tasks/task-list-item"
import WithUserRoute from "../../../view/components/routes/with-user-route"
import HREFS from "../../../view/constants/hrefs.enum"

const PLACAHOLDER_TASKS: TaskType[] = [
  { id: "1", name: "Routine", description: "", userId: "1" },
  { id: "2", name: "Supermarket", description: "", userId: "1" },
  { id: "3", name: "Pets", description: "", userId: "1" },
  { id: "4", name: "Cars", description: "", userId: "1" },
  { id: "5", name: "Bills", description: "", userId: "1" },
  { id: "6", name: "Bank", description: "", userId: "1" }
]

const TaskListPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <div className="pageTitle">Tasks</div>
      <div className="list">
        {PLACAHOLDER_TASKS.map((task: TaskType) => (
          <TaskListItem className="listItem" key={task.id} task={task} />
        ))}
      </div>
      <AddButton href={HREFS.TASKS_ADD} />
    </div>
  )
}

export default WithUserRoute(TaskListPage)
