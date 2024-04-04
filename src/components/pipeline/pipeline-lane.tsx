"use client";

import { TLaneGetPayload } from "@/lib/types";
import { useMemo } from "react";
import ConfirmActionModal from "@/components/global/confirm-action-modal";
import {
  cn,
  formatter,
  queryKeys,
  snapshotDragging,
  zPriority,
} from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLane } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PipelineTicket from "./pipeline-ticket";
import useDisplayModal from "@/hooks/use-display-modal";
import CustomModal from "../global/custom-modal";
import CreateLaneForm from "../forms/create-lane";
import CreateTicket from "../forms/create-ticket";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface Props {
  subAccountId: string;
  index: number;
  lane: TLaneGetPayload;
}

const PipeLineLane = ({ subAccountId, index, lane }: Props) => {
  const { setOpen } = useDisplayModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteLaneMutation = useMutation({
    mutationKey: [queryKeys.lane],
    mutationFn: async () => await deleteLane(lane.id),
    onSuccess: () => {
      router.refresh();
      toast.success("Lane Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.lane] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete lane"
      );
    },
  });

  const laneAmount = useMemo(() => {
    return lane.tickets.reduce((sum, ticket) => sum + ticket.value, 0);
  }, [lane.tickets]);

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  return (
    <Draggable draggableId={lane.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) snapshotDragging(provided, 300, 0);
        return (
          <section
            className=" h-[750px] w-[300px] relative rounded-lg overflow-visible flex-shrink-0 "
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <ConfirmActionModal
              heading="Are you sure you want to delete this lane?"
              description="This action cannot be undone."
              isLoadingConfirmAction={deleteLaneMutation.isPending}
              confirmAction={deleteLaneMutation.mutate}
              confirmActionLabel="Delete"
            >
              <DropdownMenu>
                <div
                  className={cn(
                    "h-14 backdrop-blur-lg bg-secondary/70 flex items-center p-4 justify-between",
                    zPriority.pr1
                  )}
                >
                  {/* {laneDetails.order} */}
                  <div className="flex items-center w-full gap-2">
                    <div
                      className={cn("w-4 h-4 rounded-full")}
                      style={{ background: randomColor }}
                    />
                    <span className="font-bold text-sm">{lane.name}</span>
                  </div>
                  <div className="flex items-center flex-row gap-x-1">
                    <Badge className="bg-white text-black">
                      {formatter(laneAmount)}
                    </Badge>
                    <DropdownMenuTrigger>
                      <MoreVertical className="text-muted-foreground cursor-pointer" />
                    </DropdownMenuTrigger>
                  </div>
                </div>

                <Droppable droppableId={lane.id} key={lane.id} type="ticket">
                  {(provided) => (
                    <div
                      className="w-full mt-2 space-y-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {lane.tickets.sort((a, b) => a.order - b.order).map((ticket, index) => (
                        <PipelineTicket
                          subAccountId={subAccountId}
                          ticket={ticket}
                          key={ticket.id}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                      setOpen(
                        <CustomModal
                          title="Edit Lane Details"
                          subheading="Please fill out the required fields"
                          className="h-fit"
                        >
                          <CreateLaneForm
                            pipelineId={lane.pipelineId}
                            data={lane}
                          />
                        </CustomModal>
                      );
                    }}
                  >
                    <Edit size={15} />
                    Edit
                  </DropdownMenuItem>

                  <AlertDialogTrigger>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Trash size={15} />
                      Delete Lane
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                      setOpen(
                        <CustomModal
                          title="Create A Ticket"
                          subheading="Tickets are a great way to keep track of tasks"
                          className="max-w-[600px] h-fit"
                        >
                          <CreateTicket
                            laneId={lane.id}
                            subAccountId={subAccountId}
                            data={{}}
                          />
                        </CustomModal>
                      );
                    }}
                  >
                    <PlusCircleIcon size={15} />
                    Create Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ConfirmActionModal>
          </section>
        );
      }}
    </Draggable>
  );
};

export default PipeLineLane;
