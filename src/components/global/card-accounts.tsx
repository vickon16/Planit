import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type cardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  disabled?: boolean;
};

const CardAccounts = ({
  title,
  description,
  icon: Icon,
  href,
  className,
  disabled,
}: cardProps) => {
  return (
    <Card
      className={cn(
        "w-full flex flex-col items-center justify-between",
        className
      )}
    >
      <CardHeader>
        <CardTitle className={cn("text-clampMd text-center")}>
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="border p-3">
        <Icon className="size-12 shrink-0" />
      </CardContent>
      <CardFooter className="mt-6 w-full">
        {!!disabled ? (
          <Button disabled variant="ghost" className="p-2 w-full h-fit flex">
            Not Allowed
          </Button>
        ) : (
          <Link
            href={href}
            className={buttonVariants({
              variant: "secondary",
              className: "h-fit px-6 text-center w-full",
            })}
          >
            Continue as {title} User
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardAccounts;
