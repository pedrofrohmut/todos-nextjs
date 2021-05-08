import { ReactElement } from "react"

const EditTaskPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Edit Task</h1>
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
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  )
}

export default EditTaskPage
