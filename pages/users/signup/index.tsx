import { ReactElement } from "react"
import Link from "next/link"

const SignUpPage = (): ReactElement => {
  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Sign Up</h1>
      <form>
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div className="formGroup">
          <label htmlFor="email">E-mail address</label>
          <input id="email" type="email" />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" />
        </div>
        <div className="formGroup">
          <input type="submit" value="Submit" />
        </div>
      </form>
      <div className="questionAndLink">
        Already registered?
        <Link href="/users/signin">
          <a>Sign in</a>
        </Link>
      </div>
    </div>
  )
}

export default SignUpPage
