"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import { sendInvitation } from "@/lib/queries";
import useDisplayModal from "@/hooks/use-display-modal";
import { TPlanitAccounts } from "@/lib/types";
import { TUserInvitationSchema, userInvitationSchema } from "@/lib/zodSchemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomModal from "../global/custom-modal";
import CustomForm from "./custom-form";
import { zPriority } from "@/lib/utils";
import { Role } from "@prisma/client";

interface SendInvitationProps {
  type: TPlanitAccounts;
  accountId: string;
}

const SendInvitation: React.FC<SendInvitationProps> = ({ type, accountId }) => {
  const router = useRouter();
  const { setOpen, setClose } = useDisplayModal();
  const form = useForm<TUserInvitationSchema>({
    resolver: zodResolver(userInvitationSchema),
    defaultValues: {
      email: "",
      role: type === "agency" ? "AGENCY_TEAM_MEMBER" : "SUBACCOUNT_TEAM_MEMBER",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TUserInvitationSchema) => {
    try {
      await sendInvitation(type, accountId, values);
      toast.success("Invitation Sent Successfully", {
        description: "We would now wait for the user to accept this invitation",
      });

      router.refresh();
      setClose();
    } catch (error: unknown) {
      toast.error("Error Sending Invitation", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
      console.log(error);
    }
  };

  return (
    <Button
      size="lg"
      isLoading={isLoading}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Send An Invitation"
            subheading="Make sure the user is signed up before sending an invitation"
            className="max-w-[600px] h-auto"
          >
            <Card className="py-4">
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <CustomForm
                      form={form}
                      type="text"
                      name="email"
                      disabled={isLoading}
                      formLabel="Email"
                      placeholder="Email..."
                      isRequired
                    />

                    <CustomForm
                      form={form}
                      type="select"
                      name="role"
                      disabled={isLoading}
                      formLabel="User Role"
                      placeholder="Select User Role..."
                      selectData={
                        type === "agency"
                          ? [
                              {
                                id: "1",
                                value: Role.AGENCY_TEAM_MEMBER,
                                title: " Agency Team Member",
                              },
                              {
                                id: "2",
                                value: Role.SUBACCOUNT_OWNER,
                                title: " Sub Account User",
                              },
                            ]
                          : type === "subAccount"
                          ? [
                              {
                                id: "1",
                                value: Role.SUBACCOUNT_TEAM_MEMBER,
                                title: " Sub Account Team Member",
                              },
                            ]
                          : []
                      }
                      isRequired
                    />

                    <Button disabled={isLoading} isLoading={isLoading} type="submit">
                      Send Invitation
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </CustomModal>
        );
      }}
    >
      Send Invitation
    </Button>
  );
};

export default SendInvitation;
