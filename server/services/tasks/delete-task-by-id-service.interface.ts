export default interface IDeleteTaskByIdService {
  execute: (taskId: string) => Promise<void>
}
