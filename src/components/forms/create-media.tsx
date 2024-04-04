"use client";

import { Button } from "@/components/ui/button";
import { TPlanitAccounts } from "@/lib/types";
import { TMediaFormSchema, mediaFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import CustomForm from "./custom-form";
import { createMedia } from "@/lib/queries";
import useDisplayModal from "@/hooks/use-display-modal";

type Props = {
  type: TPlanitAccounts;
  accountId: string;
};

const CreateMediaForm = ({ type, accountId }: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();
  const form = useForm<TMediaFormSchema>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      name: "",
      price: undefined,
      image: "",
      description: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: TMediaFormSchema) {
    try {
      await createMedia(type, accountId, values);
      toast.success("Successfully created media");
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create media"
      );
    }
  }

  return (
    <Card className="w-full py-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex-1">
              <CustomForm
                form={form}
                type="file-upload"
                name="image"
                apiEndPoint="media"
                formLabel="Media Image"
                disabled={isLoading}
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomForm
                form={form}
                type="text"
                name="name"
                formLabel="Name"
                placeholder="Media Name..."
                disabled={isLoading}
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomForm
                form={form}
                type="number"
                name="price"
                formLabel="Price"
                placeholder="Media Price..."
                disabled={isLoading}
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomForm
                form={form}
                type="textarea"
                name="description"
                formLabel="Description"
                placeholder="Media Description..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
              Create Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateMediaForm;
