import { Session } from "next-auth";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { appLinks } from "@/lib/appLinks";

type Props = {
  className?: string;
};

const AgencySubAccountButton = ({ className }: Props) => {
  return (
    <div
      className={buttonVariants({
        variant: "ghost",
        size: "lg",
        className,
      })}
    >
      <Link
        href={appLinks.agency}
        className="flex items-center gap-x-0.5 text-sm"
      >
        <span>Account</span>
      </Link>
    </div>
  );
};

export default AgencySubAccountButton;
