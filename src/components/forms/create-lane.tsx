"use client";

import { Button } from "@/components/ui/button";
import { TPlanitAccounts } from "@/lib/types";
import { TLaneFormSchema, laneFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import CustomForm from "./custom-form";
import { createLane, updateLane } from "@/lib/queries";
import useDisplayModal from "@/hooks/use-display-modal";
import { Lane } from "@prisma/client";

type Props = {
  pipelineId: string;
  data: Partial<Lane>;
};

const CreateLaneForm = ({ pipelineId, data }: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();
  const form = useForm<TLaneFormSchema>({
    resolver: zodResolver(laneFormSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: TLaneFormSchema) {
    try {
      if (data?.id) {
        await updateLane(data.id, values);
      } else {
        await createLane(pipelineId, values);
      }
      
      toast.success("Successfully created lane");
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create lane"
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
                placeholder="Lane Name..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <Button type="submit" isLoading={isLoading}>
              Save Lane
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateLaneForm;
