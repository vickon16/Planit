import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useDisplayModal from "@/hooks/use-display-modal";
import { createFunnelPage, updateFunnelPage } from "@/lib/queries";
import { TFunnelPageFormSchema, funnelPageFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunnelPage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "./custom-form";
import { TEditor, TEditorElement } from "@/hooks/use-editor";

interface Props {
  data: Partial<FunnelPage>;
  funnelId: string;
}

const pageElements : TEditorElement[] = [
  {
    content: [],
    id: "__body",
    name: "Body",
    styles: { backgroundColor: "white" },
    type: "__body",
  },
]

const CreateFunnelPage = ({ data, funnelId }: Props) => {
  const router = useRouter();
  const { setClose } = useDisplayModal();

  const form = useForm<TFunnelPageFormSchema>({
    resolver: zodResolver(funnelPageFormSchema),
    defaultValues: {
      name: data?.name || "",
      pathName: data?.pathName || "",
      order: data?.order || 0,
      elements : data?.elements || JSON.stringify(pageElements)
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TFunnelPageFormSchema) => {
    try {
      if (data?.id) {
        await updateFunnelPage(data.id, {
          ...values,
          pathName: values.pathName?.toLowerCase(),
        });
      } else {
        await createFunnelPage(funnelId, {
          ...values,
          pathName: values.pathName?.toLowerCase(),
        });
      }

      toast.success(
        `Successfully ${data?.id ? "Updated" : "Created"} FunnelPage`
      );
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${data?.id ? "Update" : "Create"} funnelPage`
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex-1">
          <CustomForm
            form={form}
            type="text"
            name="name"
            formLabel="Name"
            placeholder="Page Name..."
            disabled={isLoading}
            isRequired
          />
        </div>

        <div className="flex-1">
          <CustomForm
            form={form}
            type="text"
            name="pathName"
            formLabel="Path Name"
            placeholder="Path for the page..."
            disabled={isLoading}
            isRequired
          />
        </div>

        <Button type="submit" isLoading={isLoading}>
          Save Funnel Page
        </Button>
      </form>
    </Form>
  );
};

export default CreateFunnelPage;
