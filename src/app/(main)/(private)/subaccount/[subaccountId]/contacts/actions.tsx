import {
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";

import ConfirmActionModal from "@/components/global/confirm-action-modal";
import { getCurrentUser } from "@/lib/auth-actions";
import { deleteContact } from "@/lib/queries";
import { TContactGetPayload } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CellActionsProps = {
  rowData: TContactGetPayload;
};

const CellActions: React.FC<CellActionsProps> = ({
  rowData,
}: CellActionsProps) => {
  const router = useRouter();

  const userQueryData = useQuery({
    queryKey: [queryKeys.user],
    queryFn: async () => getCurrentUser(),
  });

  const currentUser = userQueryData.data;
  const isSubAccountOwner = currentUser?.subAccount?.userId === currentUser?.id;

  const deleteContactMutation = useMutation({
    mutationFn: async () => await deleteContact(rowData.id),
    onSuccess: () => {
      toast("Contact Deleted Successfully", {
        description: "This contact is no longer part of your leads.",
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error deleting contact");
      console.log(error);
    },
  });

  return (
    <ConfirmActionModal
      heading="Are you sure you want to delete this Contact?"
      description="This action cannot be undone."
      isLoadingConfirmAction={deleteContactMutation.isPending}
      confirmAction={deleteContactMutation.mutate}
      confirmActionLabel="Delete"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {isSubAccountOwner && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 cursor-pointer">
                <Trash size={15} /> Remove Contact
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ConfirmActionModal>
  );
};

export default CellActions;
