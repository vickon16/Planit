import ClientOnly from "@/components/client-only";
import BlurPage from "@/components/global/blur-page";
import Sidebar from "@/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { appLinks } from "@/lib/appLinks";
import { getCustomSession } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const AgencyIdLayout = async ({ children, params }: Props) => {
  const session = await getCustomSession();
  if (!session || !session.user) redirect(appLinks.site);

  const agency = await db.agency.findUnique({
    where: {
      id: params.agencyId,
      OR: [
        // if the user is the agency owner,
        { userId: session.user.id },
        // if the user is an agency team member with access
        { agencyTeams: { some: { userId: session.user.id, access: true } } },
      ],
    },
    include: {
      user: true,
      subAccounts: {
        include: { notifications: { orderBy: { createdAt: "desc" } } },
      },
      notifications: { orderBy: { createdAt: "desc" } },
      planitAccount: { include: { planitSubscription: true } },
    },
  });

  const agencySubscription = agency?.planitAccount?.planitSubscription;

  if (
    !agency ||
    !agencySubscription ||
    agencySubscription.subscriptionEndDate < new Date()
  )
    redirect(appLinks.agency);

  return (
    <section className="overflow-hidden">
      <ClientOnly loader={<Skeleton className="h-[100svh] w-[300px] " />}>
        <Sidebar type="agency" defaultOpen={true} data={agency} />

        {/* mobile side bar */}
        <Sidebar type="agency" data={agency} />
      </ClientOnly>

      <div className="md:pl-[300px]">
        <div className="relative min-h-[100svh]">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </section>
  );
};

export default AgencyIdLayout;
