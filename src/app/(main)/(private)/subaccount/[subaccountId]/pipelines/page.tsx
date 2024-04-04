import Heading from "@/components/heading";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CreatePipelineButton from "@/components/pipeline/create-pipeline-button";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FolderSearch } from "lucide-react";
import PipelineCard from "@/components/pipeline/pipeline-card";

type Props = {
  params: { subaccountId: string };
};

const PipelinesPage = async ({ params }: Props) => {
  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  return (
    <section className="space-y-4">
    <div className="flex justify-between items-center">
      <Heading
        heading="Your Pipelines"
        description="All your Pipelines are displayed here"
      />
      <CreatePipelineButton subAccountId={params.subaccountId} />
    </div>

    <Separator />

    <Command className="bg-transparent">
      <CommandInput placeholder="Search for pipeline name..." />
      <CommandList className="pb-40 max-h-full ">
        <CommandEmpty className="text-muted-foreground py-10 text-center">
          ...No Pipeline...
        </CommandEmpty>

        {Array.isArray(pipelines) && pipelines.length > 0 ? (
          <CommandGroup heading="Pipelines">
            <div className="flex flex-wrap gap-4 pt-4">
              {pipelines.map((pipeline) => (
                <CommandItem
                  key={pipeline.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <PipelineCard pipeline={pipeline} />
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
  </section>
  );
};


export default PipelinesPage;
