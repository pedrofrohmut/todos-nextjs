export default interface ICheckPasswordService {
  execute: (password: string, passwordHash: string) => Promise<boolean>
}
