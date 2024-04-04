"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import useDisplayModal from "@/hooks/use-display-modal";
import { updateAgencyTeamAccess, updateSubAccountTeamAccess, updateUser } from "@/lib/queries";
import { TPlanitAccounts, TUserGetPayload } from "@/lib/types";
import { TUserDataSchema, userDataSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Form, FormDescription, FormLabel } from "../ui/form";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import CustomForm from "./custom-form";

type Props = {
  type: TPlanitAccounts;
  userData: TUserGetPayload;
  isEditable: boolean;
  isAccessCapable: boolean;
};

const UserDetails = ({
  type,
  userData,
  isEditable,
  isAccessCapable,
}: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();

  const form = useForm<TUserDataSchema>({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      image: userData?.image || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!userData.id) return;
    try {
      await updateUser(userData.id, values);
      toast.success("User Details updated successfully");
      router.refresh();
      setClose();
    } catch (error) {
      toast.error("Failed to update user details");
      console.log(error);
    }
  };

  const handleTeamAccess = async (access: boolean) => {
    if (!userData.id) return;

    try {
      if (type === "agency") {
        if (!userData.agencyTeam) return;
        await updateAgencyTeamAccess(
          userData.id,
          userData.agencyTeam.agencyId,
          access
        );
      } else if (type === "subAccount") {
        if (!userData.subAccountTeam) return;
        await updateSubAccountTeamAccess(
          userData.id,
          userData.subAccountTeam.subAccountId,
          access
        );
      }
      
      toast.success("Team Access Updated Successfully");
      router.refresh();
      setClose();
    } catch (error) {
      toast.error("Failed to update Team access");
      console.log(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomForm
              form={form}
              type="file-upload"
              name="image"
              disabled={!isEditable || isLoading}
              formLabel="Profile Picture"
              apiEndPoint="avatar"
              readOnly={!isEditable}
              isRequired
            />

            <CustomForm
              form={form}
              type="text"
              name="name"
              disabled={!isEditable || isLoading}
              formLabel="User full name"
              placeholder="Full Name"
              readOnly={!isEditable}
              isRequired
            />

            <CustomForm
              form={form}
              type="text"
              name="email"
              formLabel="Email"
              placeholder="Email ..."
              readOnly
              isRequired
            />

            <Button disabled={isLoading} type="submit">
              Save User Details
            </Button>

            {isAccessCapable && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between gap-5 flex-wrap ">
                  <div className="space-y-2 flex-1">
                    <FormLabel> User Permissions</FormLabel>
                    <FormDescription className="mb-4">
                      Give access to this team member. They would be able to
                      control some of the agency features. This is only visible
                      to agency owners
                    </FormDescription>
                  </div>

                  <Switch
                    checked={
                      type === "agency"
                        ? userData.agencyTeam?.access
                        : type === "subAccount"
                        ? userData.subAccountTeam?.access
                        : false
                    }
                    onCheckedChange={(access) => handleTeamAccess(access)}
                  />
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
