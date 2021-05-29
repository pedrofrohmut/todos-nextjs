export default interface IDeleteUserByEmailService {
  execute: (email: string) => Promise<void>
}
