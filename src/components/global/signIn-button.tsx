import { appLinks } from "@/lib/appLinks";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const SignInButton = () => {
  return (
    <Link href={appLinks.signIn} className={buttonVariants()}>
      Sign In
    </Link>
  );
};

export default SignInButton;
