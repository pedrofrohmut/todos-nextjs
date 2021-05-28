export default class TaskNotFoundByIdError extends Error {
  public static message = "Task not found with the given taskId"

  constructor(msg?: string) {
    if (msg) {
      super(TaskNotFoundByIdError.message + ". " + msg)
    } else {
      super(TaskNotFoundByIdError.message)
    }
  }
}
