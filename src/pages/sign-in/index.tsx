import { ReactElement } from "react"
import Link from "next/link"

const SignInPage = (): ReactElement => {
  return (
    <div className="page-container">
      <h1 className="page-title">Sign in</h1>
      <form>
        <div className="form-group">
          <label htmlFor="email">E-mail address</label>
          <input id="email" type="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" />
        </div>
      </form>
      <div className="question-and-link">
        Not registered yet?
        <Link href="/sign-up">
          <a>Sign up</a>
        </Link>
      </div>
    </div>
  )
}

export default SignInPage
