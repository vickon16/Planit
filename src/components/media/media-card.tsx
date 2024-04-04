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
import { queryKeys } from "@/lib/utils";
import { PlanitMedia } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmActionModal from "../global/confirm-action-modal";
import { deleteMedia } from "@/lib/queries";

type Props = { media: PlanitMedia };

const MediaCard = ({ media }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: [queryKeys.media],
    mutationFn: async () => await deleteMedia(media.id),
    onSuccess: () => {
      router.refresh();
      toast.success("Media Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.media] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete media"
      );
    },
  });

  return (
    <ConfirmActionModal
      heading="Are you sure you want to delete this media?"
      description="This action cannot be undone."
      isLoadingConfirmAction={deleteMutation.isPending}
      confirmAction={deleteMutation.mutate}
      confirmActionLabel="Delete"
    >
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-secondary text-secondary-foreground">
          <div className="relative w-full h-40">
            <Image
              src={media.image}
              alt="preview image"
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="p-4 space-y-2">
            <div className="flex gap-x-2 items-center justify-between">
              <p className="font-semibold">{media.name}</p>
              <DropdownMenuTrigger>
                <MoreHorizontal className="cursor-pointer size-5" />
              </DropdownMenuTrigger>
            </div>
            <p className="text-clampLg leading-10 font-bold">
              <sup>$</sup>
              {media.price}
            </p>
            <p className="text-foreground/80 text-sm line-clamp-3">
              {media.description}
            </p>

            <div className="flex items-center justify-between gap-x-4 text-muted-foreground text-xs">
              <span>{media.createdAt.toDateString()}</span>
              <span>
                {media.mediaType === "AGENCY_MEDIA"
                  ? "agency media"
                  : "subaccount media"}
              </span>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(media.image);
                toast.success("Copied to Clipboard");
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete Media
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
    </ConfirmActionModal>
  );
};

export default MediaCard;
