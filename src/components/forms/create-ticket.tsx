import { Button } from "@/components/ui/button";
import useDisplayModal from "@/hooks/use-display-modal";
import {
  createTicket,
  getSubAccountTeamMembers,
  updateTicket,
} from "@/lib/queries";
import { TTicketsGetPayload } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { TTicketFormSchema, ticketFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, TagColors } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import { Separator } from "../ui/separator";
import CustomForm from "./custom-form";

import TagComponent from "@/components/pipeline/tag-component";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  laneId: string;
  subAccountId: string;
  data: Partial<TTicketsGetPayload>;
};

const tagColors: TagColors[] = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "cyan",
];

const CreateTicket = ({ laneId, subAccountId, data }: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();
  const form = useForm<TTicketFormSchema>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || undefined,
      value: data?.value?.toString() || "",
      assignedId: data?.assignedId || undefined,
    },
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>(data?.tags || []);
  const [creatingTag, setCreatingTag] = useState(false);

  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState<TagColors>("blue");

  const handleCreateTag = () => {
    if (!tagName) return toast.error("Tag Name Must not be empty");

    const tagData: Tag = {
      id: v4(),
      ticketId: v4(),
      color: tagColor,
      name: tagName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSelectedTags((prev) => [...prev, tagData]);
    setTagName("");
  };

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const querySubAccountTeam = useQuery({
    queryKey: [queryKeys.subAccountTeam],
    queryFn: async () => await getSubAccountTeamMembers(subAccountId),
  });

  const subAccountTeamMembers = useMemo(() => {
    if (querySubAccountTeam.error) {
      toast.error("Failed to fetch team members");
      return [];
    }

    return querySubAccountTeam.data || [];
  }, [querySubAccountTeam.data, querySubAccountTeam.error]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: TTicketFormSchema) {
    try {
      if (data?.id) {
        console.log({ selectedTags });
        await updateTicket(data.id, values, selectedTags);
      } else {
        console.log({ data });
        await createTicket(laneId, values, selectedTags);
      }

      toast.success(`Successfully ${data?.id ? "Updated" : "Created"} Ticket`);
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${data?.id ? "Update" : "Create"} ticket`
      );
    }
  }

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
                formLabel="Name"
                placeholder="Ticket Name..."
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
                placeholder="Ticket Description..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <div className="flex-1">
              <CustomForm
                form={form}
                type="number"
                name="value"
                formLabel="Ticket Value"
                placeholder="Ticket Value..."
                disabled={isLoading}
                isRequired
              />
            </div>

            <div className="flex-1">
              <CustomForm
                form={form}
                type="select"
                name="assignedId"
                formLabel="Assign To Team Member"
                placeholder="Select Team Member..."
                selectData={subAccountTeamMembers.map((member) => ({
                  id: member.userId,
                  value: member.userId,
                  title: member.user.name,
                }))}
                selectTriggerClassName="max-w-full"
                disabled={isLoading}
              />
            </div>

            <Separator />

            {/* Tag Creator */}
            <div className="space-y-4">
              {selectedTags.length !== 0 && (
                <div className="flex items-center p-2 flex-wrap gap-2 bg-background border-2 border-border rounded-md">
                  {selectedTags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                      <TagComponent title={tag.name} color={tag.color} />
                      <X
                        size={14}
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => handleDeleteSelection(tag.id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {creatingTag && (
                <div className="my-4 w-full">
                  <div className="flex items-center">
                    <Input
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      placeholder="Tag name"
                      className="w-full h-10"
                    />
                    <span
                      className="bg-primary flex items-center justify-center p-1 size-10 rounded-sm cursor-pointer"
                      onClick={handleCreateTag}
                    >
                      Go
                    </span>
                  </div>
                  <div className="my-2 flex items-center justify-between gap-2 flex-wrap">
                    <aside className="flex items-center gap-x-1.5 w-fit">
                      {tagColors.map((color) => (
                        <span
                          key={color}
                          onClick={() => setTagColor(color)}
                          className={cn("size-6 cursor-pointer", {
                            "ring-[2px] ring-white ring-offset-1":
                              tagColor === color,
                          })}
                          style={{ color: color, background: color }}
                        />
                      ))}

                      <div></div>
                    </aside>
                  </div>
                </div>
              )}

              <h3
                className="cursor-pointer flex items-center gap-x-1 border text-primary p-2 rounded-md w-fit text-sm"
                onClick={() => setCreatingTag((prev) => !prev)}
              >
                Add tags {creatingTag ? <Minus size={14} /> : <Plus size={14} />}
              </h3>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="mt-4 ml-auto"
            >
              Save Ticket
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTicket;
