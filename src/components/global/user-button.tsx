"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appLinks } from "@/lib/appLinks";
import { TUserGetPayload } from "@/lib/types";
import { zPriority } from "@/lib/utils";
import Link from "next/link";
import { Avatar } from "../ui/avatar";
import { buttonVariants } from "../ui/button";
import AgencySubAccountButton from "./agency-subaccount-button";
import SignInButton from "./signIn-button";
import SignOutButton from "./signout-button";

type Props = {
  user: TUserGetPayload | null;
};

const UserButton = ({ user }: Props) => {
  if (!user) return <SignInButton />;
  const isSubscribedUser = user?.agency?.planitAccount?.planitSubscription;
  const isExpiredSubscription =
    isSubscribedUser && isSubscribedUser.subscriptionEndDate < new Date();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.image} alt="Avatar logo" />
          <AvatarFallback className="bg-primary">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`w-56 px-1 py-2 ${zPriority.pr3}`}
      >
        <DropdownMenuLabel>
          <p className="capitalize font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground break-words">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="space-y-2">
          <Link
            href={appLinks.subscriptionPlan}
            className={buttonVariants({ className: "flex sm:hidden w-full" })}
          >
            {isSubscribedUser
              ? isExpiredSubscription
                ? "Renew Subscription"
                : "Upgrade"
              : "Subscribe"}
          </Link>
          <AgencySubAccountButton className="w-full sm:hidden flex" />
          <DropdownMenuSeparator />
          <SignOutButton className="w-full" />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
