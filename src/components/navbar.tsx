import { ModeToggle } from "@/components/global/mode-toggle";
import { appLinks } from "@/lib/appLinks";
import { getCurrentUser } from "@/lib/auth-actions";
import { cn, zPriority } from "@/lib/utils";
import Link from "next/link";
import AgencySubAccountButton from "./global/agency-subaccount-button";
import UserButton from "./global/user-button";
import Logo from "./planit-logo";
import { buttonVariants } from "./ui/button";

const Navbar = async () => {
  const user = await getCurrentUser();
  const isSubscribedUser = user?.agency?.planitAccount?.planitSubscription;
  const isExpiredSubscription =
    isSubscribedUser && isSubscribedUser.subscriptionEndDate < new Date();

  return (
    <div
      className={cn(
        "fixed top-0 right-0 left-0 px-2 h-[70px] flex items-center justify-between bg-background backdrop-blur-md shadow-sm drop-shadow-sm shadow-border/40",
        zPriority.pr3
      )}
    >
      <aside className="flex items-center gap-2">
        <Logo />
        <span className="text-xl font-bold">Planit.</span>
      </aside>

      <nav className="hidden md:flex items-center justify-center flex-1">
        <ul className="flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.id}
              className="text-foreground/70 hover:text-foreground transition-opacity duration-300 text-sm md:text-base"
            >
              {link.title}
            </Link>
          ))}
        </ul>
      </nav>

      <aside className="flex gap-2 items-center">
        <Link
          href={appLinks.subscriptionPlan}
          className={buttonVariants({ className: "hidden sm:flex" })}
        >
          {isSubscribedUser
            ? isExpiredSubscription
              ? "Renew Subscription"
              : "Upgrade"
            : "Subscribe"}
        </Link>
        <AgencySubAccountButton className="w-fit hidden sm:flex" />
        <UserButton user={user} />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navbar;

const navLinks = [
  {
    id: "1",
    title: "Pricing",
    href: "#",
  },
  {
    id: "2",
    title: "About",
    href: "#",
  },
  {
    id: "3",
    title: "Documentation",
    href: "#",
  },
  {
    id: "4",
    title: "Features",
    href: "#",
  },
];
