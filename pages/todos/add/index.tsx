import { ReactElement } from "react"

import SubmitButton from "../../../view/components/buttons/submit"
import WithUserRoute from "../../../view/components/routes/with-user-route"

const AddTodoPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Add Todo</h1>
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
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

export default WithUserRoute(AddTodoPage)
