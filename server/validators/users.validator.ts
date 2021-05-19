import validator from "validator"

export const getValidationMessageForUserId = (id?: string): string =>
  id === undefined
    ? "Please inform the user id. It is required"
    : id === ""
    ? "Please inform the user id. It cannot be blank"
    : !validator.isUUID(id, 4)
    ? "Please inform a valid user id in the uuidv4 format"
    : null

export const getValidationMessageForName = (name?: string): string =>
  name === undefined
    ? "Please inform the user name. It is required"
    : name === ""
    ? "Plese inform the user name. It cannot be blank"
    : name.length < 3
    ? "Please inform a longer name. User name must be longer than 2 characters"
    : name.length > 120
    ? "Please inform a shorter name. User name must be shorter than 120 characters"
    : null

export const getValidationMessageForEmail = (email?: string): string =>
  email === undefined
    ? "Please inform the user e-mail. It is require"
    : email === ""
    ? "Please inform the user e-mail. It cannot be blank"
    : !validator.isEmail(email)
    ? `Please inform a valid and complete e-mail address with @ and domain. Example: "my_email@my_domain.com"`
    : null

export const getValidationMessageForPassword = (pass?: string): string =>
  pass === undefined
    ? "Please inform the user password. It is required"
    : pass === ""
    ? "Please inform th user password. It cannot be blank"
    : pass.length < 3
    ? "Please inform a longer user password. Password must be longer than 2 characters"
    : pass.length > 32
    ? "Please inform a shroter user password. Password must be shorter than 33 characters"
    : null
