import validator from "validator"

export default class UserValidator {
  public static getMessageForUserId(id?: string): string {
    return id === undefined
      ? "Please inform the user id. It is required"
      : id === ""
      ? "Please inform the user id. It cannot be blank"
      : !validator.isUUID(id, 4)
      ? "Please inform a valid user id in the uuidv4 format"
      : null
  }

  public static getMessageForName(name?: string): string {
    return name === undefined
      ? "Please inform the user name. It is required"
      : name === ""
      ? "Plese inform the user name. It cannot be blank"
      : name.length < 3
      ? "Please inform a longer name. User name must be longer than 2 characters"
      : name.length > 120
      ? "Please inform a shorter name. User name must be shorter than 120 characters"
      : null
  }

  public static getMessageForEmail(email?: string): string {
    return email === undefined
      ? "Please inform the user e-mail. It is require"
      : email === ""
      ? "Please inform the user e-mail. It cannot be blank"
      : !validator.isEmail(email)
      ? `Please inform a valid and complete e-mail address with @ and domain. Example: "my_email@my_domain.com"`
      : null
  }

  public static getMessageForPassword(password?: string): string {
    return password === undefined
      ? "Please inform the user password. It is required"
      : password === ""
      ? "Please inform th user password. It cannot be blank"
      : password.length < 3
      ? "Please inform a longer user password. Password must be longer than 2 characters"
      : password.length > 32
      ? "Please inform a shroter user password. Password must be shorter than 33 characters"
      : null
  }

  public static getMessageForConfirmPassword(password?: string, confirmPassword?: string): string {
    return password === undefined ||
      password === "" ||
      confirmPassword === undefined ||
      confirmPassword === ""
      ? "Password and/or confirm password are either blank or not defined"
      : password !== confirmPassword
      ? "Password and confirm password do not match"
      : null
  }
}
