import MediaCard from "@/components/media/media-card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlanitMedia } from "@prisma/client";
import { FolderSearch } from "lucide-react";
import Image from "next/image";

type Props = {
  mediaArray: PlanitMedia[] | undefined;
  smallDisplay?: boolean;
};

const MediaComponent = ({ mediaArray, smallDisplay }: Props) => {
  return (
    <>
      {Array.isArray(mediaArray) && mediaArray.length > 0 ? (
        !smallDisplay ? (
          <Command className="bg-transparent">
            <CommandInput placeholder="Search for media name..." />
            <CommandList className="pb-40 max-h-full ">
              <CommandEmpty className="text-muted-foreground py-10 text-center">
                ...No Media Files...
              </CommandEmpty>

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
            </CommandList>
          </Command>
        ) : (
          <div className="flex flex-col flex-wrap gap-4 pt-4">
            {mediaArray.map((media) => (
              <div
                key={media.id}
                className="p-0 max-w-[200px] w-full rounded-sm"
              >
                <article className="border w-full rounded-lg bg-secondary text-secondary-foreground">
                  <div className="relative w-full h-12">
                    <Image
                      src={media.image}
                      alt="preview image"
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>

                  <div className="p-2 space-y-1">
                    <div className="flex gap-x-2 items-center justify-between text-xs">
                      <p className="font-semibold">{media.name}</p>
                    </div>
                    <p className="text-xs font-bold">
                      <sup>$</sup>
                      {media.price}
                    </p>
                    <p className="text-foreground/80 text-xs line-clamp-1">
                      {media.description}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center w-full flex-col gap-2 my-10">
          <FolderSearch size={80} className="dark:text-muted text-slate-300" />
          <p className="text-muted-foreground ">Empty! no files to show.</p>
        </div>
      )}
    </>
  );
};

export default MediaComponent;
