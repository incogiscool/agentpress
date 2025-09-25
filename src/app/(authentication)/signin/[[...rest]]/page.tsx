import { SignIn } from "@clerk/nextjs";

export default function Signin() {
  return (
    <SignIn
      signUpUrl="/signup"
      signInUrl="/signin"
      forceRedirectUrl={"/dashboard"}
    />
  );
}
