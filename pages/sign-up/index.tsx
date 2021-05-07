import { ReactElement } from "react"
import Link from "next/link"

const SignUpPage = (): ReactElement => {
  return (
    <div className="page-container">
      <h1 className="page-title">Sign Up</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail address</label>
          <input id="email" type="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" />
        </div>
      </form>
      <div className="question-and-link">
        Already registered?
        <Link href="/sign-in">
          <a>Sign in</a>
        </Link>
      </div>
    </div>
  )
}

export default SignUpPage
