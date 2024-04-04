import Heading from "@/components/heading";
import CreateMediaButton from "@/components/media/create-media-button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import MediaCard from "@/components/media/media-card";
import { FolderSearch } from "lucide-react";

type Props = {
  params: { agencyId: string };
};

const MediaPage = async ({ params }: Props) => {
  const media = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { planitAccount: { include: { planitMedia: true } } },
  });

  const mediaArray = media?.planitAccount?.planitMedia;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading
          heading="Media Bucket"
          description="All your Agency Media are displayed here"
        />
        <CreateMediaButton type="agency" accountId={params.agencyId} />
      </div>

      <Separator />

      <Command className="bg-transparent">
        <CommandInput placeholder="Search for media name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty className="text-muted-foreground py-10 text-center">
            ...No Media Files...
          </CommandEmpty>

          {Array.isArray(mediaArray) && mediaArray.length > 0 ? (
            <CommandGroup heading="Media Files">
              <div className="flex flex-wrap gap-4 pt-4">
                {mediaArray.map((media) => (
                  <CommandItem
                    key={media.id}
                    className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                  >
                    <MediaCard media={media} />
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          ) : (
            <div className="flex items-center justify-center w-full flex-col gap-2 my-10">
              <FolderSearch
                size={80}
                className="dark:text-muted text-slate-300"
              />
              <p className="text-muted-foreground ">Empty! no files to show.</p>
            </div>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaPage;
