"use client";

import ConfirmActionModal from "@/components/global/confirm-action-modal";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appLinks } from "@/lib/appLinks";
import { acceptRevokeInvitation } from "@/lib/queries";
import { TInvitationGetPayload } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  invitation: TInvitationGetPayload;
};

const InvitationPageClient = ({ invitation }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutationRevoke = useMutation({
    mutationFn: () => acceptRevokeInvitation(invitation, "REVOKED"),
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [queryKeys.invitation] });
      toast.success("Invitation Revoked", {
        description: `You have successfully rejected this invitation`,
      });
      router.push(appLinks.agency);
    },
    onError: (error) => {
      toast.error("Error Revoking Invitation", { description: error.message });
    },
  });

  const mutationAccept = useMutation({
    mutationFn: () => acceptRevokeInvitation(invitation, "ACCEPTED"),
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [queryKeys.invitation] });
      toast.success("Invitation Accepted", {
        description: `You are now part of the agency`,
      });
      router.push(appLinks.agency);
    },
    onError: (error) => {
      toast.error("Error Accepting Invitation", { description: error.message });
    },
  });

  return (
    <section className="p-4 text-center h-[60svh] w-full flex justify-center items-center flex-col">
      <ConfirmActionModal
        heading="Are you sure you want to accept this invitation?"
        description="This action cannot be undone."
        isLoadingConfirmAction={mutationAccept.isPending}
        confirmAction={mutationAccept.mutate}
        confirmActionLabel="Accept"
      >
        <Card className="w-full py-4 max-w-[700px] space-y-4">
          <CardHeader className="space-y-4">
            <CardTitle>Invitation Request</CardTitle>
            <CardDescription className="max-w-prose mx-auto w-full text-base">
              <span className="text-foreground">
                {invitation?.agency
                  ? invitation.agency.name
                  : invitation.subAccount
                  ? invitation.subAccount.name
                  : ""}
              </span>{" "}
              has sent an invitation to you to join them as {invitation.role}.
              Please choose from the option below if you want to accept this
              invitation or revoke it.
            </CardDescription>
          </CardHeader>

          <CardContent className="w-full max-w-[500px] mx-auto flex flex-row items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="lg"
              className="flex-2"
              isLoading={mutationRevoke.isPending}
              onClick={() => mutationRevoke.mutate()}
            >
              Revoke
            </Button>

            <AlertDialogTrigger asChild className="flex-1">
              <Button size="lg" isLoading={mutationAccept.isPending}>
                Accept
              </Button>
            </AlertDialogTrigger>
          </CardContent>
        </Card>
      </ConfirmActionModal>
    </section>
  );
};

export default InvitationPageClient;
