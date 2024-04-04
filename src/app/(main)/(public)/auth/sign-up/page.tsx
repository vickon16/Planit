import GoogleForm from "@/components/forms/googleForm";
import Heading from "@/components/heading";
import Logo from "@/components/planit-logo";
import { appLinks } from "@/lib/appLinks";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="w-full max-w-[500px] rounded-md p-6 border flex flex-col items-center justify-center space-y-8">
      <Logo />
      <Heading
        heading="Sign Up to Planit"
        description="We Welcome you to our Platform."
        center
        headingSize="base"
      />
      <GoogleForm />
      <p className="w-full text-center text-sm">
        {"Already have an account? "}{" "}
        <Link
          className="text-primary text-base font-bold"
          href={appLinks.signIn}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
