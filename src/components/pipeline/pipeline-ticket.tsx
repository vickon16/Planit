import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDisplayModal from "@/hooks/use-display-modal";
import { deleteTicket, getContacts } from "@/lib/queries";
import { TTicketsGetPayload } from "@/lib/types";
import { formatter, queryKeys, snapshotDragging } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  LinkIcon,
  Loader2,
  MoreHorizontalIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CreateTicket from "../forms/create-ticket";
import ConfirmActionModal from "../global/confirm-action-modal";
import CustomModal from "../global/custom-modal";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import TagComponent from "./tag-component";
import { Draggable } from "@hello-pangea/dnd";

type Props = {
  subAccountId: string;
  ticket: TTicketsGetPayload;
  index: number;
};

const PipelineTicket = ({ subAccountId, ticket, index }: Props) => {
  const router = useRouter();
  const { setOpen } = useDisplayModal();
  const queryClient = useQueryClient();

  const queryTicketContacts = useQuery({
    enabled: !!subAccountId || !!ticket.id,
    queryKey: [queryKeys.contact],
    queryFn: async () => await getContacts(subAccountId),
  });

  const deleteTicketMutation = useMutation({
    mutationKey: [queryKeys.ticket],
    mutationFn: async () => await deleteTicket(ticket.id),
    onSuccess: () => {
      router.refresh();
      toast.success("Ticket Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.ticket] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete ticket"
      );
    },
  });

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) snapshotDragging(provided, 300, 0);
        return (
          <Card
            className="bg-primary/20 shadow-none transition-all"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <ConfirmActionModal
              heading="Are you sure you want to delete this ticket?"
              description="This action cannot be undone."
              isLoadingConfirmAction={deleteTicketMutation.isPending}
              confirmAction={deleteTicketMutation.mutate}
              confirmActionLabel="Delete"
            >
              <DropdownMenu>
                <CardHeader className="p-[12px] space-y-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg w-full">{ticket.name}</span>
                    <DropdownMenuTrigger>
                      <MoreHorizontalIcon className="text-muted-foreground" />
                    </DropdownMenuTrigger>
                  </CardTitle>

                  <span className="text-muted-foreground text-xs !mt-1">
                    {new Date().toLocaleDateString()}
                  </span>

                  <div className="flex items-center flex-wrap gap-2">
                    {ticket.tags?.map((tag) => (
                      <TagComponent
                        key={tag.id}
                        title={tag.name}
                        color={tag.color}
                      />
                    ))}
                  </div>

                  {ticket.description && (
                    <CardDescription className="w-full text-foreground/90">
                      {ticket.description}
                    </CardDescription>
                  )}

                  {!queryTicketContacts.data ||
                  queryTicketContacts.isLoading ? (
                    <div className="w-full flex items-center justify-center p-2">
                      <Loader2
                        size={20}
                        className="animate-spin duration-300 text-primary"
                      />
                    </div>
                  ) : (
                    <div
                      className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center font-semibold"
                      onClick={() => {
                        setOpen(
                          <CustomModal
                            title="Ticket Contacts List"
                            subheading="These are all your ticket contacts gotten from your funnel"
                            className="max-w-[600px] h-fit"
                          >
                            <div>
                              {queryTicketContacts.data.map((contact) => (
                                <div
                                  key={contact.id}
                                  className="flex gap-2 items-center"
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage alt="contact" />
                                    <AvatarFallback className="bg-primary text-sm text-white uppercase">
                                      {contact.name.slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-bold">
                                      {contact.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.email}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CustomModal>
                        );
                      }}
                    >
                      <LinkIcon size={14} />
                      Contacts
                    </div>
                  )}
                </CardHeader>

                <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
                  <div className="flex item-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        alt="contact"
                        src={ticket.assigned?.user.image}
                      />
                      <AvatarFallback className="bg-primary text-sm text-white">
                        {ticket.assigned?.user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col justify-center text-foreground/70 text-sm">
                      {!!ticket.assignedId ? (
                        <span className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                          Assigned to <br /> {ticket.assigned?.user.name}
                        </span>
                      ) : (
                        <span> Not Assigned </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {formatter(ticket.value)}
                  </span>
                </CardFooter>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Trash size={15} />
                      Delete Ticket
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                      setOpen(
                        <CustomModal
                          title="Edit your ticket"
                          subheading="Please Fill out the required fields"
                          className="max-w-[600px] h-fit"
                        >
                          <CreateTicket
                            laneId={ticket.laneId}
                            subAccountId={subAccountId}
                            data={ticket}
                          />
                        </CustomModal>
                      );
                    }}
                  >
                    <Edit size={15} />
                    Edit Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ConfirmActionModal>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default PipelineTicket;
