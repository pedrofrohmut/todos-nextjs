export default interface IGenerateAuthenticationTokenService {
  execute: (userId: string) => string
}
