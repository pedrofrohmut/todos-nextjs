import { ReactElement } from "react"
import Link from "next/link"
import SubmitButton from "../../../shared/components/buttons/submit"

const SignInPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Sign in</h1>
      <form>
        <div className="formGroup">
          <label htmlFor="email">E-mail address</label>
          <input id="email" type="email" />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <div className="formGroup">
          <SubmitButton />
        </div>
      </form>
      <div className="questionAndLink">
        Not registered yet?
        <Link href="/users/signup">
          <a>Sign up</a>
        </Link>
      </div>
    </div>
  )
}

export default SignInPage
