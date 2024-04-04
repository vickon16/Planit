"use client";

import { FunnelPage } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Mail, Trash } from "lucide-react";
import ConfirmActionModal from "../global/confirm-action-modal";
import { useMutation } from "@tanstack/react-query";
import { deleteFunnelPage } from "@/lib/queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { Draggable } from "@hello-pangea/dnd";
import { snapshotDragging } from "@/lib/utils";

type Props = {
  funnelPage: FunnelPage;
  index: number;
  activePage: boolean;
};

const FunnelStepsCard = ({ activePage, funnelPage, index }: Props) => {
  const router = useRouter();

  const deleteSubAccountMutation = useMutation({
    mutationFn: async () => await deleteFunnelPage(funnelPage.id),
    onSuccess: () => {
      toast("Funnel page Deleted Successfully", {
        description: "This page does not exist any more",
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error deleting page");
      console.log(error);
    },
  });

  return (
    <Draggable draggableId={funnelPage.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) snapshotDragging(provided, 300, 0);
        return (
          <Card
            className="p-0 relative my-2"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <ConfirmActionModal
              heading="Are you sure you want to delete this page?"
              description="This action cannot be undone."
              isLoadingConfirmAction={deleteSubAccountMutation.isPending}
              confirmAction={deleteSubAccountMutation.mutate}
              confirmActionLabel="Delete"
            >
              <CardContent className="p-0 flex items-center gap-4 flex-row cursor-grab">
                <div className="h-14 w-14 bg-muted flex items-center justify-center">
                  <Mail />
                  <ArrowDown
                    size={18}
                    className="absolute -bottom-2 text-primary"
                  />
                </div>
                {funnelPage.name}
              </CardContent>
              {activePage && (
                <div className="size-2 -top-1 left-0 absolute bg-emerald-500 rounded-full" />
              )}
              <AlertDialogTrigger asChild>
                <Trash
                  size={18}
                  className="text-destructive absolute -top-2 right-0 cursor-pointer"
                />
              </AlertDialogTrigger>
            </ConfirmActionModal>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default FunnelStepsCard;
