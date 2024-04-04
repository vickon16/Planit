"use client";

import useDisplayModal from "@/hooks/use-display-modal";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import FunnelDetails from "../forms/funnel-details";
import { Button } from "../ui/button";
import CustomModal from "./custom-modal";

type Props = {
  subAccountId: string;
  className? : string;
};

const CreateFunnelButton = ({ subAccountId, className }: Props) => {
  const { setOpen } = useDisplayModal();

  return (
    <Button
      className={cn("flex gap-2", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Funnel Information"
            subheading="Lets create an funnel for your subAccount."
            className="max-w-[600px] h-fit"
          >
            <FunnelDetails
              subAccountId={subAccountId}
              data={{}}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Funnel
    </Button>
  );
};

export default CreateFunnelButton;
