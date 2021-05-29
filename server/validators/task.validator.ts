import validator from "validator"

export default class TaskValidator {
  public static getMessageForTaskId(id?: string): string {
    return id === undefined
      ? "Please inform the task id. It is required"
      : id === ""
      ? "Please inform the task id. It cannot be blank"
      : !validator.isUUID(id, 4)
      ? "Please inform a valid task id in the uuidv4 format"
      : null
  }

  public static getMessageForName(name?: string): string {
    return name === undefined
      ? "Please inform the task name. It is required"
      : name === ""
      ? "Plese inform the task name. It cannot be blank"
      : name.length < 3
      ? "Please inform a longer task name. Task name must be longer than 2 characters"
      : name.length > 120
      ? "Please inform a shorter task name. Task name must be shorter than 120 characters"
      : null
  }

  public static getMessageForDescription(description?: string): string {
    return description.length < 3
      ? "Please inform a longer task description. Task description must be longer than 2 characters"
      : description.length > 512
      ? "Please inform a shorter task description. Task description must be shorter than 512 characters"
      : null
  }
}
