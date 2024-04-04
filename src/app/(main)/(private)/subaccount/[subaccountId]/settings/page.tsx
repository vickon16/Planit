import AgencyDetails from "@/components/forms/agency-details";
import SubAccountDetails from "@/components/forms/subaccount-details";
import UserDetails from "@/components/forms/user-details";
import Heading from "@/components/heading";
import { appLinks } from "@/lib/appLinks";
import { getCurrentUser } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: { subaccountId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const user = await getCurrentUser();

  const subAccount = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  });

  if (!user || !subAccount) redirect(appLinks.site);
  const isSubAccountOwner = subAccount.userId === user.id;

  return (
    <div className="space-y-6">
      <Heading
        heading="Settings"
        description="Manage your account and subAccount settings"
      />

      <div className="flex xl:flex-row flex-col gap-4">
        <SubAccountDetails
          agencyId={subAccount.agencyId}
          data={subAccount}
          isSubAccountOwner={isSubAccountOwner}
        />
        <UserDetails
          type="subAccount"
          userData={user}
          isEditable={!!user.id}
          isAccessCapable={false}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
