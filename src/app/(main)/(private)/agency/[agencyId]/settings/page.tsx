import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import Heading from "@/components/heading";
import { appLinks } from "@/lib/appLinks";
import { getCurrentUser } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: { agencyId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const user = await getCurrentUser();

  const agency = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!user || !agency) redirect(appLinks.site);
  const isAgencyOwner = agency.userId === user.id

  return (
    <div className="space-y-6">
      <Heading
        heading="Settings"
        description="Manage your account and agency settings"
      />

      <div className="flex xl:flex-row flex-col gap-4">
        <AgencyDetails data={agency} isAgencyOwner={isAgencyOwner} />
        <UserDetails
          type="agency"
          userData={user}
          isEditable={!!user.id}
          isAccessCapable={false}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
