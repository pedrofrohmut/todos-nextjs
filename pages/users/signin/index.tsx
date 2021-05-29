import { Dispatch, ReactElement, SetStateAction, useContext, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import UserValidator from "../../../server/validators/user.validator"
import SubmitButton from "../../../view/components/buttons/submit"
import UsersApi from "../../../view/api/users.api"
import HREFS from "../../../view/constants/hrefs.enum"
import RequestErrorAlert from "../../../view/components/alerts/request-error"
import WithGuestRoute from "../../../view/components/routes/with-guest-route"

import signInAction from "../../../view/context/actions/users/signin.action"
import AppContext from "../../../view/context"

type Fields = {
  email: string
  password: string
}

const SignInPage = (): ReactElement => {
  const router = useRouter()
  const { dispatch } = useContext(AppContext)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [requestErr, setRequestErr] = useState<string>("")

  const validate = ({ email, password }: Fields): boolean => {
    const emailValidationMessage = UserValidator.getMessageForEmail(email)
    const passwordValidationMessage = UserValidator.getMessageForPassword(password)
    setEmailError(emailValidationMessage || "")
    setPasswordError(passwordValidationMessage || "")
    const hasErrorMessages = emailValidationMessage !== null || passwordValidationMessage !== null
    setIsDisabled(hasErrorMessages)
    return hasErrorMessages
  }

  const handleChange = (
    value: string,
    { email, password }: Fields,
    setter: Dispatch<SetStateAction<string>>
  ): void => {
    setter(value)
    validate({ email, password })
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
    const hasErrors = validate({ email, password })
    if (hasErrors) {
      setIsDisabled(true)
      setIsSubmitting(false)
      return
    }
    try {
      const response = await UsersApi.signinUser({ email, password })
      const payload = {
        user: {
          id: response.body.user.id,
          name: response.body.user.name,
          email: response.body.user.email,
          token: response.body.token
        }
      }
      setRequestErr("")
      signInAction(dispatch, payload)
      router.push("/tasks/list")
    } catch (err) {
      setIsSubmitting(false)
      if (err.body) {
        setRequestErr(err.body)
      } else {
        router.push(HREFS.ERRORS_SERVER)
        console.log(err)
      }
    }
  }

  return (
    <div className="pageContainer">
      <h1 className="pageTitle">Sign in</h1>
      <form onSubmit={handleSubmit}>
        {requestErr !== "" && (
          <div className="formAlertContainer">
            <RequestErrorAlert message={requestErr} />
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

export default WithGuestRoute(SignInPage)
