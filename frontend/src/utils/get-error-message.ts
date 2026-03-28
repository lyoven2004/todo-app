import { ApiError } from "@/lib/axios";
import { toast } from "sonner";

export function getAuthErrorMessage(message?: string): string {
  switch (message) {
    case "Invalid credentials":
      return "Email or password is incorrect."

    case "Unauthorized":
      return "You are not authorized. Please sign in again."

    case "User not found":
      return "Account does not exist."

    default:
      return "Unable to sign in. Please try again."
  }
}

export function getRegisterErrorMessage(message?: string): string {
  switch (message) {
    case "Email already exists":
      return "This email is already registered."

    case "Invalid input":
      return "Please check your input and try again."

    default:
      return "Unable to create account. Please try again."
  }
}


export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === "string") {
        return error
    }

    return "Something went wrong"
}

export function handleMutationError(error: unknown) {
    toast.error(getErrorMessage(error))
}