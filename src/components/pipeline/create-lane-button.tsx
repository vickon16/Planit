"use client";

import useDisplayModal from "@/hooks/use-display-modal";
import { Button } from "@/components/ui/button";
import CustomModal from "../global/custom-modal";
import CreateLaneForm from "../forms/create-lane";
import { Plus } from "lucide-react";

type Props = {
  pipelineId : string;
}

const CreateLaneButton = ({pipelineId} : Props) => {
  const { setOpen } = useDisplayModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title=" Create A Lane"
            subheading="Lanes allow you to group tickets"
            className="h-fit"
          >
            <CreateLaneForm pipelineId={pipelineId} data={{}} />
          </CustomModal>
        );
      }}
      icon={<Plus size={15} />}
    >
      Create Lane
    </Button>
  );
};

export default CreateLaneButton;
