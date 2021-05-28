export default interface IDeleteTaskUseCase {
  execute: (userId: string, taskId: string) => Promise<void>
}
