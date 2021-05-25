import { Dispatch, ReactElement, SetStateAction, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import SubmitButton from "../../../view/components/buttons/submit"
import {
  getValidationMessageForEmail,
  getValidationMessageForPassword
} from "../../../server/validators/users.validator"
import UsersApi from "../../../view/api/users.api"

const SignInPage = (): ReactElement => {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [requestErr, setRequestErr] = useState<string>("")
  const [requestSuccess, setRequestSuccess] = useState<string>("")

  const handleChange = (
    value: string,
    state: { email: string; password: string },
    setter: Dispatch<SetStateAction<string>>
  ): void => {
    setter(value)
    const emailValidationMessage = getValidationMessageForEmail(state.email)
    const passwordValidationMessage = getValidationMessageForPassword(state.password)
    setEmailError(emailValidationMessage || "")
    setPasswordError(passwordValidationMessage || "")
    setIsDisabled(emailValidationMessage !== null || passwordValidationMessage !== null)
  }

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { email: value, password }, setEmail)
  }

  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { email, password: value }, setPassword)
  }

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    setEmailError(emailValidationMessage || "")
    setPasswordError(passwordValidationMessage || "")
    if (emailValidationMessage !== null || passwordValidationMessage !== null) {
      setIsDisabled(true)
    } else {
      try {
        const response = await UsersApi.signinUser({ email, password })
        console.log(response)
        setRequestErr("")
        setEmail("")
        setPassword("")
        setRequestSuccess(`Hello ${email}. You signed in with success.`)
        setTimeout(() => {
          router.push("/tasks/list")
        }, 2000)
      } catch (err) {
        if (err.body) {
          setRequestErr(err.body)
          setRequestSuccess("")
        } else {
          console.log(err)
        }
      }
    }
    setIsSubmitting(false)
  }

  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Sign in</h1>
      <form onSubmit={handleSubmit}>
        {requestErr !== "" && (
          <div className="formGroup">
            <div className="error">{requestErr}</div>
          </div>
        )}
        {requestSuccess !== "" && (
          <div className="formGroup">
            <div className="success">{requestSuccess}</div>
          </div>
        )}
        <div className="formGroup">
          <label htmlFor="email">E-mail address</label>
          <input id="email" type="email" value={email} onChange={handleChangeEmail} />
          {emailError !== "" && <div className="error">{emailError}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={handleChangePassword} />
          {passwordError !== "" && <div className="error">{passwordError}</div>}
        </div>
        <div className="formGroup">
          <SubmitButton isDisabled={isDisabled} isSubmitting={isSubmitting} />
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
