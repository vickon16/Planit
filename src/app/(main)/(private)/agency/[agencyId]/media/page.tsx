import Heading from "@/components/heading";
import CreateMediaButton from "@/components/media/create-media-button";
import MediaComponent from "@/components/media/media-component";
import { Separator } from "@/components/ui/separator";
import { getMedia } from "@/lib/queries";

type Props = {
  params: { agencyId: string };
};

const MediaPage = async ({ params }: Props) => {
  const mediaArray = await getMedia("agency", params.agencyId);

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

      <MediaComponent mediaArray={mediaArray} />
    </div>
  );
};

export default MediaPage;
