"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CommonBadge from "./common-badge";
import CommonTrashIcon from "./common-trash-icon";
import { addContact, getFunnel } from "@/lib/queries";
import { toast } from "sonner";
import { TContactFormSchema, contactFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CustomForm from "@/components/forms/custom-form";

type Props = {
  element: TEditorElement;
};

const ContactFormComponent = ({ element }: Props) => {
  const { editor, changeClickedElement } = useEditor();
  const router = useRouter();

  const form = useForm<TContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isLoading = form.formState.isLoading;

  const onFormSubmit = async (values: TContactFormSchema) => {
    if (!editor.liveMode) return;

    try {
      await addContact(editor.subAccountId, values);
      toast.success("Successfully Saved your info");
      router.refresh();

    } catch (error) {
      console.log(error);
      toast.error("Failed", { description: "Could not save your information" });
    }
  };

  return (
    <div
      style={element.styles}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
      className={cn(
        "p-2 w-full relative transition-all",
        {
          "!border-blue-500": editor.selectedElement.id === element.id,

          "!border-solid": editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !editor.liveMode,
        }
      )}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text="Contact" />
      )}

      <Card className="max-w-[500px] w-[500px]">
        <CardHeader>
          <CardTitle className="text-clampMd">We Can Help you</CardTitle>
          <CardDescription>Contact Us</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex-1">
                <CustomForm
                  form={form}
                  type="text"
                  name="name"
                  formLabel="Name"
                  placeholder="Your Name..."
                  disabled={isLoading}
                  isRequired
                />
              </div>
              <div className="flex-1">
                <CustomForm
                  form={form}
                  type="text"
                  name="email"
                  formLabel="Email"
                  placeholder="Your Email..."
                  disabled={isLoading}
                  isRequired
                />
              </div>

              <Button className="mt-4" isLoading={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default ContactFormComponent;
