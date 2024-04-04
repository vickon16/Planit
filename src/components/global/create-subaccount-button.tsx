"use client";

import useDisplayModal from "@/hooks/use-display-modal";
import { Button } from "../ui/button";
import CustomModal from "./custom-modal";
import SubAccountDetails from "../forms/subaccount-details";
import { PlusCircleIcon } from "lucide-react";
import { SubAccount } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  agencyId: string;
  subAccountData: Partial<SubAccount>;
  className?: string;
};

const CreateSubAccountButton = ({
  agencyId,
  subAccountData,
  className,
}: Props) => {
  const { setOpen } = useDisplayModal();

  return (
    <Button
      className={cn("flex gap-2", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="SubAccount Information"
            subheading="Lets create an subAccount for you business. You can edit subAccount settings later from the subAccount settings tab."
            className="max-w-[800px]"
          >
            <SubAccountDetails
              agencyId={agencyId}
              data={subAccountData}
              isSubAccountOwner={true}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};

export default CreateSubAccountButton;
