import Heading from "@/components/heading";
import Link from "next/link";
import { appLinks } from "@/lib/appLinks";
import Logo from "@/components/planit-logo";
import GoogleForm from "@/components/forms/googleForm";

const SigninPage = async () => {
  return (
    <div className="w-full max-w-[500px] rounded-md p-6 border flex flex-col items-center justify-center space-y-6">
      <Logo />
      <Heading
        heading="Sign In to Planit"
        description="We are happy to have you back."
        center
        headingSize="base"
      />
      <GoogleForm />
      <p className="w-full text-center text-sm">
        {"Don't have an account? "}{" "}
        <Link
          className="text-primary text-base font-bold"
          href={appLinks.signUp}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SigninPage;
