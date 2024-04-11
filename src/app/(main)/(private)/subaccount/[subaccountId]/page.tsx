import Heading from "@/components/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appLinks } from "@/lib/appLinks";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AreaChart } from "@tremor/react";
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatter } from "@/lib/utils";
import CircleProgress from "@/components/global/circle-progress";
import { fakeDataPendingSessions, fakeDataSessions } from "@/lib/constants";

type Props = {
  params: {
    subaccountId: string;
  };
};

const SubAccountIdPage = async ({ params }: Props) => {
  const subAccount = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
    include: {
      subAccountTeam : true,
      funnels: { include: { funnelPages: true } },
      pipelines: { include: { lanes: { include: { tickets: true } } } },
    },
  });

  if (!subAccount) redirect(appLinks.subAccount);

  const net =
    subAccount.pipelines.reduce(
      (acc1, value1) =>
        (acc1 += value1.lanes.reduce(
          (acc2, value2) =>
            (acc2 += value2.tickets.reduce(
              (acc3, value3) => (acc3 += value3.value),
              0
            )),
          0
        )),
      0
    ) || 0;

  const pageVisits =
    subAccount.funnels.reduce(
      (acc2, value2) =>
        (acc2 += value2.funnelPages.reduce(
          (acc3, value3) => (acc3 += value3.visits),
          0
        )),
      0
    ) || 0;

  const pricePerVisit = 2; // in $
  const potentialIncome = net + pageVisits * pricePerVisit;

  const currentYear = new Date().getFullYear();

  return (
    <section className="relative h-full">
      <Heading
        heading="Dashboard"
        description={`${subAccount.name} account information is displayed here`}
      />

      <Separator className=" my-6" />

      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">
                {!!net
                  ? `${formatter(parseFloat(net.toFixed(2)))}`
                  : formatter(net)}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated for your account.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Potential Income</CardDescription>
              <CardTitle className="text-4xl">
                {!!potentialIncome
                  ? `${formatter(parseFloat(potentialIncome.toFixed(2)))}`
                  : formatter(potentialIncome)}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Active Team Members</CardDescription>
              <CardTitle className="text-4xl">
                {subAccount.subAccountTeam.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflects the number of active team members you own and manage.
            </CardContent>
            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>SubAccount Goal</CardTitle>
              <CardDescription className="mt-2">
                Reflects the number of sub accounts team members you want to own and manage.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col w-full gap-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Current: {subAccount.subAccountTeam.length}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Goal: {subAccount.goal}
                  </span>
                </div>
                <Progress
                  value={(subAccount.subAccountTeam.length / subAccount.goal) * 100}
                />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>

        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>

            <AreaChart
              className="text-sm stroke-primary"
              data={[
                ...(fakeDataSessions || []),
                ...(fakeDataPendingSessions || []),
              ]}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={30}
              showAnimation={true}
            />
          </Card>

          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>

            <CardContent>
              <CircleProgress value={20} description={<></>} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SubAccountIdPage;
