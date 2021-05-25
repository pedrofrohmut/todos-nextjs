import { useRouter } from "next/router"
import { ReactElement, useContext, useEffect } from "react"

import AppContext from "../../../view/context"
import HREFS from "../../../view/constants/hrefs.enum"
import SubmitButton from "../../../view/components/buttons/submit"
import isUserLoggedIn from "../../../view/utils/is-user-logged-in.util"

const EditTaskPage = (): ReactElement => {
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
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

export default EditTaskPage
