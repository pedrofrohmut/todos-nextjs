import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import AppContext from "../../../view/context"
import HREFS from "../../../view/constants/hrefs.enum"
import SubmitButton from "../../../view/components/buttons/submit"
import isUserLoggedIn from "../../../view/utils/is-user-logged-in.util"
import RequestSuccessAlert from "../../../view/components/alerts/request-success"
import RequestErrorAlert from "../../../view/components/alerts/request-error"
import {
  getValidationMessageForEmail,
  getValidationMessageForName,
  getValidationMessageForPassword
} from "../../../server/validators/users.validator"
import UsersApi from "../../../view/api/users.api"

type Fields = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const getValidationMessageForConfirmPassword = (
  password?: string,
  confirmPassword?: string
): string => {
  if (
    password === undefined ||
    password === "" ||
    confirmPassword === undefined ||
    confirmPassword === ""
  ) {
    return "Password and/or confirm password are blank or not defined"
  }
  if (password !== confirmPassword) {
    return "Password and confirm password do not match"
  }
  return null
}

const SignUpPage = (): ReactElement => {
  const router = useRouter()
  const { state, dispatch } = useContext(AppContext)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [nameError, setNameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")

  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [requestErr, setRequestErr] = useState<string>("")
  const [requestSuccess, setRequestSuccess] = useState<string>("")

  useEffect(() => {
    if (state.user !== undefined) {
      // Avoid request when context is good
      router.push(HREFS.TASKS_LIST)
    } else {
      isUserLoggedIn(dispatch).then(isLoggedIn => {
        if (isLoggedIn) {
          router.push(HREFS.TASKS_LIST)
        }
      })
    }
  }, [state.user])

  const validate = ({ name, email, password, confirmPassword }: Fields): boolean => {
    const nameValidationMessage = getValidationMessageForName(name)
    const emailValidationMessage = getValidationMessageForEmail(email)
    const passwordValidationMessage = getValidationMessageForPassword(password)
    const confirmPasswordValidationMessage = getValidationMessageForConfirmPassword(
      password,
      confirmPassword
    )
    setNameError(nameValidationMessage || "")
    setEmailError(emailValidationMessage || "")
    setPasswordError(passwordValidationMessage || "")
    setConfirmPasswordError(confirmPasswordValidationMessage || "")
    const hasErrorMessages =
      nameValidationMessage !== null ||
      emailValidationMessage !== null ||
      passwordValidationMessage !== null ||
      confirmPasswordValidationMessage !== null
    setIsDisabled(hasErrorMessages)
    return hasErrorMessages
  }

  const handleChange = (
    value: string,
    { name, email, password, confirmPassword }: Fields,
    setter: Dispatch<SetStateAction<string>>
  ): void => {
    setter(value)
    validate({ name, email, password, confirmPassword })
  }

  const handleChangeName = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { name: value, email, password, confirmPassword }, setName)
  }

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { name, email: value, password, confirmPassword }, setEmail)
  }

  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { name, email, password: value, confirmPassword }, setPassword)
  }

  const handleChangeConfirmPassword = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value
    handleChange(value, { name, email, password, confirmPassword: value }, setConfirmPassword)
  }

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    const hasErrors = validate({ name, email, password, confirmPassword })
    if (hasErrors) {
      setIsDisabled(true)
      setIsSubmitting(false)
      return 
    }
    try {
      await UsersApi.createUser({ name, email, password })
      setRequestErr("")
      setRequestSuccess(`Welcome ${name}. User created with success. Redirecting...`)
      setTimeout(() => {
        router.push(HREFS.USERS_SIGNIN)
      }, 2000)
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
      <h1 className="pageTitle">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {requestErr !== "" && (
          <div className="formAlertContainer">
            <RequestErrorAlert requestErr={requestErr} />
          </div>
        )}
        {requestSuccess !== "" && (
          <div className="formAlertContainer">
            <RequestSuccessAlert requestSuccess={requestSuccess} />
          </div>
        )}
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={handleChangeName} />
          {nameError !== "" && <div className="error">{nameError}</div>}
        </div>
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
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
          />
          {confirmPasswordError !== "" && <div className="error">{confirmPasswordError}</div>}
        </div>
        <div className="formGroup">
          <SubmitButton isDisabled={isDisabled} isSubmitting={isSubmitting} />
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
