export function usernameToInternalEmail(username: string): string {
  return `${username.toLowerCase()}@seal-app.invalid`;
}
