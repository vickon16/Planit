"use client";

import { getMedia } from "@/lib/queries";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
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
import MediaComponent from "@/components/media/media-component";
import Loading from "@/components/global/loading";

type Props = {
  subAccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const query = useQuery({
    queryKey: [queryKeys.media],
    queryFn: async () => getMedia("subAccount", props.subAccountId),
  });

  return (
    <div className="h-full overflow-auto p-4">
      {query.isLoading ? (
        <div className="max-h-[20svh] h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <MediaComponent mediaArray={query.data} smallDisplay />
      )}
    </div>
  );
};

export default MediaBucketTab;
