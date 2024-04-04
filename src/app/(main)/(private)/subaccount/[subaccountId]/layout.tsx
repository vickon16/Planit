import Unauthorized from "@/components/global/unauthorized";
import Sidebar from "@/components/sidebar";
import { appLinks } from "@/lib/appLinks";
import { getCurrentUser, getCustomSession } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientOnly from "@/components/client-only";
import BlurPage from "@/components/global/blur-page";
import Heading from "@/components/heading";
import SubAccountDetails from "@/components/forms/subaccount-details";
import { checkSubAccountSubscription } from "@/lib/queries";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const SubAccountIdLayout = async ({ children, params }: Props) => {
  const { subAccount, user, subAccountAccess } =
    await checkSubAccountSubscription(params.subaccountId);

  const isSubAccountOwner = subAccount.userId === user.id;

  // a subaccount user should not have access when their agency is not subscribed
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

  const { name, subAccountLogo, companyPhone, address, country, state, city } =
    subAccount;

  if (
    !name ||
    !subAccountLogo ||
    !companyPhone ||
    !address ||
    !country ||
    !state ||
    !city
  ) {
    return (
      <div className="flex justify-center items-center">
        <div className="max-w-[850px] p-4 space-y-6">
          <Heading
            heading="Edit Sub Account Details"
            description="Please fill out the required fields"
            center
          />
          <SubAccountDetails
            agencyId={subAccount.agencyId}
            data={subAccount}
            isSubAccountOwner={isSubAccountOwner}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden">
      <ClientOnly>
        <Sidebar type="subAccount" defaultOpen={true} data={subAccount} />

        {/* mobile side bar */}
        <Sidebar type="subAccount" data={subAccount} />
      </ClientOnly>

      <div className="md:pl-[300px]">
        <div className="relative min-h-[100svh]">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </section>
  );
};

export default SubAccountIdLayout;
