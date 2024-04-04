"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import CustomModal from "@/components/global/custom-modal";
import useDisplayModal from "@/hooks/use-display-modal";
import { getCurrentUser } from "@/lib/auth-actions";
import { TSubAccountGetPayload } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSubAccount } from "@/lib/queries";
import ConfirmActionModal from "@/components/global/confirm-action-modal";
import SubAccountDetails from "@/components/forms/subaccount-details";

type CellActionsProps = {
  rowData: TSubAccountGetPayload;
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

  const deleteSubAccountMutation = useMutation({
    mutationFn: async () => await deleteSubAccount(rowData.id),
    onSuccess: () => {
      toast("SubAccount User Deleted Successfully", {
        description:
          "The user is no longer part of the subAccount team members",
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error deleting subAccount user");
      console.log(error);
    },
  });

  const currentUser = userQueryData.data;
  const isSubAccountOwner = currentUser?.subAccount?.userId === currentUser?.id;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(rowData.companyEmail);
    toast.success("Email copied to clipboard");
  };

  return (
    <ConfirmActionModal
      heading="Are you sure you want to delete this subAccount?"
      description="This action cannot be undone. The subAccount information would be erased from the database."
      isLoadingConfirmAction={deleteSubAccountMutation.isPending}
      confirmAction={deleteSubAccountMutation.mutate}
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

          {isSubAccountOwner && (
            <DropdownMenuItem
              className="flex gap-2 cursor-pointer"
              onClick={() => {
                setOpen(
                  <CustomModal
                    title="Edit SubAccount Details"
                    subheading="Please fill out the required fields"
                    className="max-w-[800px]"
                  >
                    <SubAccountDetails
                      agencyId={rowData.agencyId}
                      data={rowData}
                      isSubAccountOwner={isSubAccountOwner}
                    />
                  </CustomModal>
                );
              }}
            >
              <Edit size={15} />
              Edit Details
            </DropdownMenuItem>
          )}

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2 cursor-pointer">
              <Trash size={15} /> Remove SubAccount
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </ConfirmActionModal>
  );
};

export default CellActions;
