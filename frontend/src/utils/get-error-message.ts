
export function getAuthErrorMessage(code?: string) {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Email or password is incorrect.";
    case "USER_NOT_FOUND":
      return "Account does not exist.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please try again later.";
    default:
      return "Unable to sign in. Please try again.";
  }
}