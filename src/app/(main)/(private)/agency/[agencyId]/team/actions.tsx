import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import UserDetails from "@/components/forms/user-details";
import ConfirmActionModal from "@/components/global/confirm-action-modal";
import CustomModal from "@/components/global/custom-modal";
import useDisplayModal from "@/hooks/use-display-modal";
import { getCurrentUser } from "@/lib/auth-actions";
import { deleteAgencyTeamMember } from "@/lib/queries";
import { TUserGetPayload } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CellActionsProps = {
  rowData: TUserGetPayload;
};

const CellActions: React.FC<CellActionsProps> = ({
  rowData,
}: CellActionsProps) => {
  const { setOpen } = useDisplayModal();
  const router = useRouter();

  const userQueryData = useQuery({
    queryKey: [queryKeys.user],
    queryFn: async () => getCurrentUser(),
  });

  const currentUser = userQueryData.data;
  const isAgencyOwner = currentUser?.agency?.userId === currentUser?.id;

  const deleteAgencyTeamMutation = useMutation({
    mutationFn: async () => await deleteAgencyTeamMember(rowData.id),
    onSuccess: () => {
      toast("User Deleted Successfully", {
        description: "The user is no longer part of the agency team members",
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error deleting user");
      console.log(error);
    },
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(rowData?.email);
    toast.success("Email copied to clipboard");
  };

  return (
    <ConfirmActionModal
      heading="Are you sure you want to delete this Agency team member?"
      description="This action cannot be undone. The Team Member information would be erased from the database."
      isLoadingConfirmAction={deleteAgencyTeamMutation.isPending}
      confirmAction={deleteAgencyTeamMutation.mutate}
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
          <DropdownMenuItem
            className="flex gap-2 text-sm cursor-pointer"
            onClick={handleCopyEmail}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              setOpen(
                <CustomModal
                  title="Edit User Details"
                  subheading="You can change permissions only when the user has an owned subaccount"
                  className="max-w-[800px]"
                >
                  <UserDetails
                    type="agency"
                    userData={rowData}
                    isEditable={currentUser?.id === rowData.id}
                    isAccessCapable={isAgencyOwner}
                  />
                </CustomModal>
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>

          {isAgencyOwner && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 cursor-pointer">
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ConfirmActionModal>
  );
};

export default CellActions;
