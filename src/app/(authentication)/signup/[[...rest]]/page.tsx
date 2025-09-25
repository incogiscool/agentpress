import { SignUp } from "@clerk/nextjs";

export default function Signup() {
  return <SignUp signInUrl="/signin" forceRedirectUrl={"/dashboard"} />;
}
