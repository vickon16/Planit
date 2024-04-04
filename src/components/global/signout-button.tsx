"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { appLinks } from "@/lib/appLinks";
import React, {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TLoadingState } from "@/lib/types";

interface SignOutButtonProps extends HTMLAttributes<HTMLElement> {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const SignOutButton = ({ className, setIsOpen }: SignOutButtonProps) => {
  const router = useRouter();
  const [signOutState, setSignOutState] = useState<TLoadingState>("idle");

  const signOutFunc = async () => {
    setSignOutState("pending");
    try {
      await signOut({ callbackUrl: appLinks.site });
      !!setIsOpen && setIsOpen(false);
      setSignOutState("fulfilled");
      router.refresh();
    } catch (error) {
      setSignOutState("rejected");
      toast.error("Something went wrong");
    }
  };

  return (
    <Button
      onClick={signOutFunc}
      isLoading={signOutState === "pending"}
      variant="destructive"
      className={className}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
