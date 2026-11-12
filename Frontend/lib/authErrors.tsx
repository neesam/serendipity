import { AuthError } from "@supabase/supabase-js";

export function friendlyAuthError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Please confirm your email first. Check your inbox for the link.";
    case "weak_password":
      return "That password is too weak. Try a longer one.";
    case "user_already_exists":
    case "email_exists":
      return "An account with that email already exists. Try logging in.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}