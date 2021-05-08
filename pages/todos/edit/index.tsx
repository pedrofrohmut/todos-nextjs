import { ReactElement } from "react"

const EditTodoPage = (): ReactElement => {
  return (
    <div className="page-container">
      <h1 className="page-title">Edit Todo</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={6}></textarea>
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  )
}

export default EditTodoPage
