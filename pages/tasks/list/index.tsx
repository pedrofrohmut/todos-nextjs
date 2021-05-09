import { ReactElement } from "react"
import Link from "next/link"

import TaskListItem, { TaskType } from "../../../shared/components/tasks/task-list-item"

import AddButton from "../../../shared/components/buttons/add"

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
      <Link href="/task/add">
        <AddButton />
      </Link>
    </div>
  )
}

export default TaskListPage
