export default interface IGenerateAuthenticationTokenService {
  execute: (userId: string) => Promise<string>
}
