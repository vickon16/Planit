"use client";

import { Agency } from "@prisma/client";
import { NumberInput } from "@tremor/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormDescription, FormLabel } from "../ui/form";

import {
  deleteAgency,
  updateAgency,
  createAgency,
} from "@/lib/queries";
import { TAgencyFormSchema, agencyFormSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";
import ConfirmActionModal from "../global/confirm-action-modal";
import { Button } from "../ui/button";
import CustomForm from "./custom-form";
import { appLinks } from "@/lib/appLinks";
import { TLoadingState } from "@/lib/types";

type Props = {
  data: Partial<Agency>;
  isAgencyOwner : boolean;
};

const AgencyDetails = ({ data, isAgencyOwner }: Props) => {
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState<TLoadingState>("idle");

  const form = useForm<TAgencyFormSchema>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (formValues: TAgencyFormSchema) => {
    try {
      if (data?.id) {
        await updateAgency(data.id, formValues);
      } else {
        await createAgency(formValues);
      }

      toast.success(`Agency ${data?.id ? "Updated" : "Created"} Successfully`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: `Could not ${data?.id ? "update" : "create"} your agency`,
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency("pending");
    try {
      // WIP : discontinue the subscription
      await deleteAgency(data.id);

      toast.success("Agency Deleted Successfully");
      router.refresh();
      router.push(appLinks.site);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: "Could not delete your agency",
      });
    } finally {
      setDeletingAgency("idle");
    }
  };

  return (
    <ConfirmActionModal
      heading="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete the Agency account and all related sub accounts."
      isLoadingConfirmAction={deletingAgency === "pending"}
      confirmAction={handleDeleteAgency}
      confirmActionLabel="Delete"
    >
      <Card className="w-full py-4">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings
            later from the agency settings tab.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="flex-1">
                <CustomForm
                  type="file-upload"
                  name="agencyLogo"
                  apiEndPoint="agencyLogo"
                  form={form}
                  formLabel="Agency Logo"
                  formItemClassName="flex-1"
                  disabled={isLoading}
                  isRequired
                />
              </div>

              <div className="flex md:flex-row gap-4">
                <CustomForm
                  type="text"
                  name="name"
                  form={form}
                  formLabel="Agency Name"
                  placeholder="Your agency name"
                  formItemClassName="w-full flex-1"
                  disabled={isLoading}
                  isRequired
                />

                <CustomForm
                  type="text"
                  name="companyEmail"
                  form={form}
                  formLabel="Company Agency Email"
                  placeholder="Your company agency Email"
                  formItemClassName="w-full flex-1"
                  disabled={isLoading}
                  isRequired
                  readOnly
                />
              </div>

              <div className="flex md:flex-row gap-4">
                <CustomForm
                  type="text"
                  name="companyPhone"
                  form={form}
                  formLabel="Agency Phone Number"
                  placeholder="Your company agency Phone"
                  formItemClassName="flex-1"
                  disabled={isLoading}
                  isRequired
                />
              </div>

              <div className="w-full">
                <CustomForm
                  type="switch"
                  name="whiteLabel"
                  form={form}
                  formDescription="Turning on while label mode will show your agency logo
                  to all sub accounts by default. You can overwrite this
                  functionality through sub account settings."
                  formLabel="WhiteLabel Agency"
                  formItemClassName="flex flex-row items-center justify-between rounded-lg border gap-4 p-4"
                  disabled={isLoading}
                />
              </div>

              <CustomForm
                type="text"
                name="address"
                form={form}
                formLabel="Address"
                placeholder="123 st..."
                formItemClassName="flex-1"
                disabled={isLoading}
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
                  disabled={isLoading}
                  isRequired
                />
                <CustomForm
                  type="text"
                  name="state"
                  form={form}
                  formLabel="State"
                  placeholder="State..."
                  formItemClassName="flex-1"
                  disabled={isLoading}
                  isRequired
                />
                <CustomForm
                  type="text"
                  name="city"
                  form={form}
                  formLabel="City"
                  placeholder="City..."
                  formItemClassName="flex-1"
                  disabled={isLoading}
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
                disabled={isLoading}
                isRequired
              />

              {/* Agency Goal */}
              <div className="flex flex-col gap-2">
                <FormLabel>Create A Goal</FormLabel>
                <FormDescription>
                  ✨ Create a goal for your agency. As your business grows your
                  goals grow too so {"don't"} forget to set the bar higher!
                </FormDescription>
                <NumberInput
                  defaultValue={data?.goal}
                  onValueChange={(value) =>
                    form.setValue("goal", Boolean(Number(value)) ? value : undefined)
                  }
                  min={1}
                  max={10}
                  className="!bg-background !border !border-input my-2"
                  placeholder="Agency Goal"
                  onWheel={(event) => event.currentTarget.blur()}
                />
              </div>

              <Button type="submit" isLoading={isLoading} size="lg">
                Save Agency
              </Button>
            </form>
          </Form>

          {/* Danger Zone */}
          {data?.id && isAgencyOwner && (
            <div className="flex flex-col rounded-lg border border-destructive gap-2 p-4 mt-4">
              <div className="text-sm text-destructive whitespace-nowrap">
                Danger Zone
              </div>
              <div className="text-muted-foreground">
                Deleting your agency cannot be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>

              <AlertDialogTrigger className="flex items-start">
                <Button
                  isLoading={isLoading || deletingAgency === "pending"}
                  variant="destructive"
                >
                  Delete Agency
                </Button>
              </AlertDialogTrigger>
            </div>
          )}
        </CardContent>
      </Card>
    </ConfirmActionModal>
  );
};

export default AgencyDetails;
