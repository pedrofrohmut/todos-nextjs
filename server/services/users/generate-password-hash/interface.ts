export default interface IGeneratePasswordHashService {
  execute: (password: string) => Promise<string>
}
