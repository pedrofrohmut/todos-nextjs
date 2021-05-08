import { ReactElement } from "react"
import Link from "next/link"

export type TaskType = {
  id: string
  name: string
  description: string
  userId: string
}

type Props = {
  task: TaskType
  className: string
}

const TaskListItem = ({ task: { id, name }, className }: Props): ReactElement => {
  return (
    <div className={className}>
      <Link href={`/task/details/${id}`}>
        <a>{name}</a>
      </Link>
    </div>
  )
}

export default TaskListItem
