import Heading from "@/components/heading";
import { buttonVariants } from "@/components/ui/button";
import { appLinks } from "@/lib/appLinks";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelDetails from "@/components/forms/funnel-details";
import FunnelSteps from "@/components/funnel/funnel-steps";

type Props = {
  params: { funnelId: string; subaccountId: string };
};

const FunnelIdPage = async ({ params }: Props) => {
  const funnel = await db.funnel.findUnique({
    where: { id: params.funnelId },
    include: { funnelPages: true, classNames: true },
  });

  if (!funnel)
    redirect(`${appLinks.subAccount}/${params.subaccountId}/funnels`);

  return (
    <section className="space-y-4">
      <div>
        <Link
          href={`${appLinks.subAccount}/${params.subaccountId}/funnels`}
          className={buttonVariants({ variant: "link" })}
        >
          &larr; Back
        </Link>
        <Heading heading={funnel.name} description={funnel.description} />
      </div>

      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnel}
            pages={funnel.funnelPages || []}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <Card className="flex-1 flex-shrink">
            <CardHeader>
              <CardTitle>Funnel Products</CardTitle>
              <CardDescription>
                Select the products and services you wish to sell on this
                funnel. You can sell one time and recurring products too.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">...No Live Products to Display...</p>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-4">
            <Heading heading="Edit your funnel" headingSize="md" />
            <div className="max-w-[800px]">
              <FunnelDetails subAccountId={params.subaccountId} data={funnel} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FunnelIdPage;
