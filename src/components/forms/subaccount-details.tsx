"use client";

import useDisplayModal from "@/hooks/use-display-modal";
import { TSubAccountFormSchema, subAccountFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Agency, SubAccount } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormDescription, FormLabel } from "../ui/form";
import CustomForm from "./custom-form";
import ConfirmActionModal from "../global/confirm-action-modal";
import { useState } from "react";
import { NumberInput } from "@tremor/react";
import { Button } from "../ui/button";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import {
  createSubAccount,
  deleteSubAccount,
  updateSubAccount,
} from "@/lib/queries";
import { appLinks } from "@/lib/appLinks";
import { TLoadingState } from "@/lib/types";

interface Props {
  agencyId: string;
  data: Partial<SubAccount>;
  isSubAccountOwner: boolean;
}

const SubAccountDetails = ({ agencyId, data, isSubAccountOwner }: Props) => {
  const { setClose } = useDisplayModal();
  const [deletingSubAccount, setDeletingSubAccount] =
    useState<TLoadingState>("idle");
  const router = useRouter();
  const form = useForm<TSubAccountFormSchema>({
    resolver: zodResolver(subAccountFormSchema),
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      subAccountLogo: data?.subAccountLogo,
    },
  });

  async function onSubmit(values: TSubAccountFormSchema) {
    try {
      if (data?.id) {
        await updateSubAccount(data.id, values);
      } else {
        await createSubAccount(agencyId, values);
      }

      toast.success(
        `Sub Account ${data?.id ? "Updated" : "Created"} Successfully`
      );
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
        {
          description: `Could not ${
            data?.id ? "update" : "create"
          } your sub account`,
        }
      );
    }
  }

  const isLoading = form.formState.isSubmitting;

  const handleDeleteSubAccount = async () => {
    if (!data?.id) return;
    setDeletingSubAccount("pending");

    try {
      // WIP : discontinue the subscription
      await deleteSubAccount(data.id);

      toast.success("SubAccount Deleted Successfully");
      router.refresh();
      router.push(appLinks.site);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: "Could not delete your subAccount",
      });
    } finally {
      setDeletingSubAccount("idle");
    }
  };

  return (
    <ConfirmActionModal
      heading="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete the SubAccount account and all related sub accounts."
      isLoadingConfirmAction={deletingSubAccount === "pending"}
      confirmAction={handleDeleteSubAccount}
      confirmActionLabel="Delete"
    >
      <Card className="w-full py-4">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex-1">
                <CustomForm
                  type="file-upload"
                  name="subAccountLogo"
                  apiEndPoint="subaccountLogo"
                  form={form}
                  formLabel="SubAccount Logo"
                  formItemClassName="flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  isRequired
                  readOnly={!isSubAccountOwner}
                />
              </div>

              <div className="flex md:flex-row gap-4">
                <CustomForm
                  type="text"
                  name="name"
                  form={form}
                  formLabel="SubAccount Name"
                  placeholder="Your subAccount name"
                  formItemClassName="w-full flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />

                <CustomForm
                  type="text"
                  name="companyEmail"
                  form={form}
                  formLabel="Company SubAccount Email"
                  placeholder="Your company subAccount Email"
                  formItemClassName="w-full flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />
              </div>

              <div className="flex md:flex-row gap-4">
                <CustomForm
                  type="text"
                  name="companyPhone"
                  form={form}
                  formLabel="SubAccount Phone Number"
                  placeholder="Your company subAccount Phone"
                  formItemClassName="flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />
              </div>

              <CustomForm
                type="text"
                name="address"
                form={form}
                formLabel="Address"
                placeholder="123 st..."
                formItemClassName="flex-1"
                disabled={!isSubAccountOwner || isLoading}
                readOnly={!isSubAccountOwner}
                isRequired
              />

              <div className="flex md:flex-row gap-4">
                <CustomForm
                  type="text"
                  name="country"
                  form={form}
                  formLabel="Country"
                  placeholder="Country..."
                  formItemClassName="flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />
                <CustomForm
                  type="text"
                  name="state"
                  form={form}
                  formLabel="State"
                  placeholder="State..."
                  formItemClassName="flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />
                <CustomForm
                  type="text"
                  name="city"
                  form={form}
                  formLabel="City"
                  placeholder="City..."
                  formItemClassName="flex-1"
                  disabled={!isSubAccountOwner || isLoading}
                  readOnly={!isSubAccountOwner}
                  isRequired
                />
              </div>

              <CustomForm
                type="text"
                name="zipCode"
                form={form}
                formLabel="Zip Code"
                placeholder="Zip Code..."
                formItemClassName="flex-1"
                disabled={!isSubAccountOwner || isLoading}
                readOnly={!isSubAccountOwner}
                isRequired
              />

              {/* SubAccount Goal */}
              <div className="flex flex-col gap-2">
                <FormLabel>Create A Goal</FormLabel>
                <FormDescription>
                  ✨ Create a goal for your subAccount. As your business grows
                  your goals grow too so {"don't"} forget to set the bar higher!
                </FormDescription>
                <NumberInput
                  readOnly={!isSubAccountOwner}
                  disabled={!isSubAccountOwner}
                  defaultValue={data?.goal}
                  onValueChange={(value) =>
                    form.setValue(
                      "goal",
                      Boolean(Number(value)) ? value : undefined
                    )
                  }
                  onWheel={(event) => event.currentTarget.blur()}
                  min={1}
                  className="!bg-background !border !border-input my-2"
                  placeholder="Sub Account Goal"
                />
              </div>

              <Button
                type="submit"
                isLoading={!isSubAccountOwner || isLoading}
                disabled={!isSubAccountOwner}
                size="lg"
              >
                Save SubAccount
              </Button>
            </form>
          </Form>

          {/* Danger Zone */}
          {data?.id && (
            <div className="flex flex-col rounded-lg border border-destructive gap-2 p-4 mt-4">
              <div className="text-sm text-destructive whitespace-nowrap">
                Danger Zone
              </div>
              <div className="text-muted-foreground">
                Deleting your subAccount cannot be undone. Your account would be
                completely removed from the database. You will no longer have
                access to funnels, contacts etc.
              </div>

              <AlertDialogTrigger className="flex items-start">
                <Button
                  isLoading={isLoading || deletingSubAccount === "pending"}
                  disabled={!isSubAccountOwner || !isSubAccountOwner}
                  variant="destructive"
                >
                  Delete SubAccount
                </Button>
              </AlertDialogTrigger>
            </div>
          )}
        </CardContent>
      </Card>
    </ConfirmActionModal>
  );
};

export default SubAccountDetails;
