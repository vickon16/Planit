"use client";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appLinks } from "@/lib/appLinks";
import { deletePipeline } from "@/lib/queries";
import { cn, queryKeys } from "@/lib/utils";
import { Pipeline } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmActionModal from "../global/confirm-action-modal";
import { buttonVariants } from "../ui/button";

type Props = { pipeline: Pipeline, className? :string, proceed? : boolean };

const PipelineCard = ({ pipeline, className, proceed=true }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: [queryKeys.pipeline],
    mutationFn: async () => await deletePipeline(pipeline.id),
    onSuccess: () => {
      router.refresh();
      toast.success("Pipeline Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.pipeline] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete pipeline"
      );
    },
  });

  return (
    <ConfirmActionModal
      heading="Are you sure you want to delete this pipeline?"
      description="This action cannot be undone."
      isLoadingConfirmAction={deleteMutation.isPending}
      confirmAction={deleteMutation.mutate}
      confirmActionLabel="Delete"
    >
      <DropdownMenu>
        <article className={cn("border w-full rounded-lg bg-secondary text-secondary-foreground bg-[url('/assets/bubbles.svg')]", className)}>
          <div className="p-4 space-y-4">
             <div className="flex gap-x-2 items-center justify-between">
              <p className="font-bold text-clampMd">{pipeline.name}</p>
              <DropdownMenuTrigger>
                <MoreHorizontal className="cursor-pointer size-5" />
              </DropdownMenuTrigger>
            </div>

            <div className="text-foreground/80 text-sm line-clamp-2">
              {pipeline.description}
            </div>

            <p className="text-xs text-muted-foreground">
              {pipeline.createdAt.toDateString()}
            </p> 

           {proceed && <Link
              href={`${appLinks.subAccount}/${pipeline.subAccountId}/pipelines/${pipeline.id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Proceed
            </Link>}
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete Pipeline
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
    </ConfirmActionModal>
  );
};

export default PipelineCard;
