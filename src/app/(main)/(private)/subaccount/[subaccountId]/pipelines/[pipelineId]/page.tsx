import { appLinks } from "@/lib/appLinks";
import { db } from "@/lib/db";
import Heading from "@/components/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import PipelineCard from "@/components/pipeline/pipeline-card";
import CreatePipelineForm from "@/components/forms/create-pipeline";
import PipelineView from "@/components/pipeline/pipeline-view";
import CreateLaneButton from "@/components/pipeline/create-lane-button";

type Props = {
  params: { subaccountId: string; pipelineId: string };
};

const PipeLineIdPage = async ({ params }: Props) => {
  const pipeline = await db.pipeline.findUnique({
    where: { id: params.pipelineId, subAccountId: params.subaccountId },
    include: {
      subAccount: true,
      lanes: {
        include: {
          tickets: {
            include: {
              tags: true,
              contact: true,
              assigned: { include: { user: true } },
            },
          },
        },
      },
    },
  });

  if (!pipeline)
    return (
      <div className="p-4 text-center h-[60svh] w-full flex justify-center items-center flex-col">
        <Heading
          heading="No Pipeline Found!"
          description="You might be accessing this page wrongly"
          center
          headingColor="destructive"
        />{" "}
      </div>
    );

  return (
    <section>
      <Link
        href={`${appLinks.subAccount}/${params.subaccountId}/pipelines`}
        className={buttonVariants({ variant: "link" })}
      >
        &larr; Back to pipelines
      </Link>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Heading heading={pipeline.name} description={pipeline.description} />
        <CreateLaneButton pipelineId={pipeline.id} />
      </div>

      <Tabs defaultValue="view" className="w-full mt-6">
        <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between">
          <div>
            <TabsTrigger value="view">Pipeline View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="view">
          <PipelineView
            pipeline={pipeline}
            subAccountId={params.subaccountId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <section className="space-y-4">
            <PipelineCard
              pipeline={pipeline}
              className="max-w-[400px]"
              proceed={false}
            />
            <CreatePipelineForm
              subAccountId={params.subaccountId}
              data={pipeline}
            />
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PipeLineIdPage;
