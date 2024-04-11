import ClientOnly from "@/components/client-only";
import FunnelEditor from "@/components/editor/funnel-editor";
import FunnelEditorNavigation from "@/components/editor/funnel-editor-navigation";
import FunnelEditorSidebar from "@/components/editor/funnel-editor-sidebar";
import Heading from "@/components/heading";
import { appLinks } from "@/lib/appLinks";
import { db } from "@/lib/db";
import { checkSubAccountSubscription } from "@/lib/queries";
import { cn, zPriority } from "@/lib/utils";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    subAccountId: string;
    funnelPageId: string;
  };
};

const EditorPage = async ({ searchParams }: Props) => {
  if (!searchParams.funnelPageId || !searchParams.subAccountId)
    redirect(appLinks.agency);

  const { subAccountAccess } = await checkSubAccountSubscription(
    searchParams.subAccountId
  );

  if (!subAccountAccess) {
    return (
      <div className="flex justify-center items-center">
        <div className="max-w-[850px] p-4 space-y-6">
          <Heading
            heading="Your Agency Does not have Current Subscription"
            description="Contact your agency to rectify and fix this issue."
            center
          />
        </div>
      </div>
    );
  }

  const funnelPage = await db.funnelPage.findFirst({
    where: { id: searchParams.funnelPageId },
    include : {funnel : true}
  });

  if (!funnelPage)
    return redirect(
      `${appLinks.subAccount}/${searchParams.subAccountId}/funnels`
    );

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background overflow-hidden",
        zPriority.pr4
      )}
    >
        <ClientOnly>
          <FunnelEditorNavigation
            funnelPage={funnelPage}
            subAccountId={searchParams.subAccountId}
          />

          <FunnelEditor />

          <FunnelEditorSidebar subAccountId={searchParams.subAccountId} />
        </ClientOnly>
    </div>
  );
};

export default EditorPage;
