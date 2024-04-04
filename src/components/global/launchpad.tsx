import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appLinks } from "@/lib/appLinks";
import { Agency, SubAccount } from "@prisma/client";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TPlanitAccounts } from "@/lib/types";

type Props = {
  type: TPlanitAccounts;
  accountId: string;
  accountLogo: string;
  isCompleteInfo: boolean;
  isConnectedPayment: boolean;
};

const LaunchPad = ({
  type,
  accountId,
  accountLogo,
  isCompleteInfo,
  isConnectedPayment,
}: Props) => {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4">
                <div className="size-[40px] relative">
                  <Image
                    src={accountLogo}
                    alt="app logo"
                    fill
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>

                <p> Fill in all your business details</p>
              </div>
              {isCompleteInfo ? (
                <CheckCircleIcon
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className={buttonVariants()}
                  href={`${
                    type === "agency" ? appLinks.agency : appLinks.subAccount
                  }/${accountId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>

            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex items-center gap-4">
                <div className="size-[40px] relative">
                  <Image
                    src="/appstore.png"
                    alt="app logo"
                    fill
                    className="rounded-md object-contain"
                  />
                </div>
                <p> Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPad;
