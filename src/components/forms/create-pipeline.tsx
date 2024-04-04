"use client";

import { Button } from "@/components/ui/button";
import { TPlanitAccounts } from "@/lib/types";
import { TPipelineFormSchema, pipelineFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import CustomForm from "./custom-form";
import { createPipeline, updatePipeline } from "@/lib/queries";
import useDisplayModal from "@/hooks/use-display-modal";
import { Pipeline } from "@prisma/client";

type Props = {
  subAccountId: string;
  data: Partial<Pipeline>;
};

const CreatePipelineForm = ({ subAccountId, data }: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();
  const form = useForm<TPipelineFormSchema>({
    resolver: zodResolver(pipelineFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: TPipelineFormSchema) {
    try {
      if (data?.id) {
        await updatePipeline(data.id, values);
      } else {
        await createPipeline(subAccountId, values);
      }
      
      toast.success("Successfully created pipeline");
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create pipeline"
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
                type="text"
                name="name"
                formLabel="Name"
                placeholder="Pipeline Name..."
                disabled={isLoading}
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomForm
                form={form}
                type="text"
                name="description"
                formLabel="Description"
                placeholder="Pipeline Description..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
              Save Pipeline
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineForm;
