"use client";

import { signIn } from "next-auth/react";
import Google from "../icons/google";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { appLinks } from "@/lib/appLinks";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { TLoadingState } from "@/lib/types";

interface ErrorType {
  error:
    | "Signin"
    | "OAuthSignin"
    | "OAuthCallback"
    | "OAuthCreateAccount"
    | "EmailCreateAccount"
    | "Callback"
    | "OAuthAccountNotLinked"
    | "EmailSignin"
    | "CredentialsSignin"
    | "default";
}

const errors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

const GoogleForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || appLinks.site;
  const error = (searchParams.get("error") as ErrorType["error"]) || "";
  const [isLoading, setIsLoading] = useState<TLoadingState>("idle");

  const handleSignIn = async () => {
    setIsLoading("pending");
    try {
      await signIn("google", { callbackUrl, redirect: false });
      setIsLoading("fulfilled");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="space-y-2 w-full text-center">
      <Button
        variant="outline"
        size="lg"
        className="w-full h-12"
        onClick={handleSignIn}
        isLoading={isLoading === "pending"}
      >
        Sign in with google <Google />
      </Button>
      {!!error && <p className="text-sm text-destructive max-w-prose">{errors[error]}</p>}
    </section>
  );
};

export default GoogleForm;
