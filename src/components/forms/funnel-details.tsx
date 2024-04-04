"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Funnel } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import Loading from "@/components/global/loading";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "@/components/global/file-upload";
import useDisplayModal from "@/hooks/use-display-modal";
import { TFunnelFormSchema, funnelFormSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";
import CustomForm from "./custom-form";
import { createFunnel, updateFunnel } from "@/lib/queries";

interface CreateFunnelProps {
  data?: Partial<Funnel>;
  subAccountId: string;
}

const FunnelDetails: React.FC<CreateFunnelProps> = ({ data, subAccountId }) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();
  const form = useForm<TFunnelFormSchema>({
    resolver: zodResolver(funnelFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      favicon: data?.favicon || "",
      subDomainName: data?.subDomainName || "",
    },
  });

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: TFunnelFormSchema) => {
    try {
      if (data?.id) {
        await updateFunnel(data.id, values);
      } else {
        await createFunnel(subAccountId, values);
      }

      toast.success(`Successfully ${data?.id ? "Updated" : "Created"} Funnel`);
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${data?.id ? "Update" : "Create"} funnel`
      );
    }
  };
  return (
    <Card className="w-full py-4">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-y-4"
          >
            <div className="flex-1">
              <CustomForm
                form={form}
                type="text"
                name="name"
                formLabel="Funnel Name"
                placeholder="Funnel Name..."
                disabled={isLoading}
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomForm
                form={form}
                type="text"
                name="description"
                formLabel="Funnel Description"
                placeholder="Funnel Description..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <div className="flex-1">
              <CustomForm
                form={form}
                type="text"
                name="subDomainName"
                formLabel="Sub Domain"
                placeholder="Sub domain for funnel..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <div className="flex-1">
              <CustomForm
                form={form}
                type="file-upload"
                apiEndPoint="subaccountLogo"
                name="favicon"
                formLabel="Favicon"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="mt-4 ml-auto"
            >
              Save Funnel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelDetails;
