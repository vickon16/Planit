import Heading from "@/components/heading";
import CreateMediaButton from "@/components/media/create-media-button";
import MediaComponent from "@/components/media/media-component";
import { Separator } from "@/components/ui/separator";
import { getMedia } from "@/lib/queries";

type Props = {
  params: { subaccountId: string };
};

const MediaPage = async ({ params }: Props) => {
  const mediaArray = await getMedia("subAccount", params.subaccountId);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading
          heading="Media Bucket"
          description="All your SubAccount Media are displayed here"
        />
        <CreateMediaButton type="subAccount" accountId={params.subaccountId} />
      </div>

      <Separator />

      <MediaComponent mediaArray={mediaArray} />

    </section>
  );
};

export default MediaPage;
