import { Resend } from "resend";
import { ENV } from "./env";

if (!ENV.resendApiKey) {
  throw new Error("RESEND_API_KEY is missing in environment variables");
}

export const resend = new Resend(ENV.resendApiKey);
