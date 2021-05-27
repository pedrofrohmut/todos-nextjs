import { ReactElement } from "react"

import SubmitButton from "../../../view/components/buttons/submit"
import WithUserRoute from "../../../view/components/routes/with-user-route"

const AddTaskPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Add Task</h1>
      <form>
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div className="formGroup">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={6}></textarea>
        </div>
        <div className="formGroup">
          {/* @ts-ignore */}
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

export default WithUserRoute(AddTaskPage)
