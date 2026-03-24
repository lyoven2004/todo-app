
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

export function getRegisterErrorMessage(code?: string) {
    switch (code) {
        case "EMAIL_ALREADY_EXISTS":
            return "This email is already registered."
        case "INVALID_INPUT":
            return "Please check your input and try again."
        case "TOO_MANY_REQUESTS":
            return "Too many attempts. Please try again later."
        default:
            return "Unable to create account. Please try again."
    }
}