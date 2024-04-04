"use client";

import { cn, queryKeys } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrentUser, getCustomSession } from "@/lib/auth-actions";
import { cancelSubscription } from "@/lib/queries";
import ConfirmActionModal from "./confirm-action-modal";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/navigation";

type Props = {
  subscriptionId: string;
  agencyId: string;
  className?: string;
};

const CancelSubscription = ({ subscriptionId, agencyId, className }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();


  const cancelMutation = useMutation({
    mutationKey: [queryKeys.subscriptionPlan],
    mutationFn: async () => await cancelSubscription(subscriptionId, agencyId),
    onSuccess: () => {
      router.refresh();
      toast.success("Subscription Canceled Successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.subscriptionPlan] });
    },
    onError: (error) => {
      toast.error(error.message || "An Error Occurred", {
        description: "Failed to cancel subscription",
      });
    },
  });

  return (
    <ConfirmActionModal
      heading="Are you sure you want to cancel this subscription?"
      description="This action cannot be undone. You would no longer have access to your accounts."
      isLoadingConfirmAction={cancelMutation.isPending}
      confirmAction={cancelMutation.mutate}
      confirmActionLabel="Cancel"
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          isLoading={cancelMutation.isPending}
          className={cn("", className)}
        >
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>
    </ConfirmActionModal>
  );
};

export default CancelSubscription;
