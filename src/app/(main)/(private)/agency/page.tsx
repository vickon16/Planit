import AgencyDetails from "@/components/forms/agency-details";

import Heading from "@/components/heading";
import { appLinks } from "@/lib/appLinks";
import { getCustomSession } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { Aperture, CopyMinus, ShieldBan, ShieldHalf } from "lucide-react";
import CardAccounts from "@/components/global/card-accounts";
import { Role } from "@prisma/client";

const AgencyPage = async () => {
  const session = await getCustomSession();
  if (!session || !session.user) redirect(appLinks.signIn);

  // check if the user has an invitation to join any agency
  const invitation = await db.invitation.findFirst({
    where: { userId: session.user.id },
  });

  if (!!invitation && !!invitation.id) {
    return redirect(`${appLinks.invitation}?invitationId=${invitation.id}`);
  }

  const agencyInclude = {
    include: { planitAccount: { include: { planitSubscription: true } } },
  };

  // look for a user that has either an agency or a subAccount
  const foundUser = await db.user.findFirst({
    where: {
      OR: [
        // if the user is the owner of the agency
        { agency: { userId: session.user.id } },
        // if the user is the owner of the subaccount,
        { subAccount: { userId: session.user.id } },
        // if the user is a team member of the agency
        { agencyTeam: { userId: session.user.id } },
        // if the user is a team member of a subaccount
        { subAccountTeam: { userId: session.user.id } },
      ],
    },
    select: {
      id: true,
      agency: agencyInclude,
      subAccount: { include: { agency: agencyInclude } },
      agencyTeam: { include: { agency: agencyInclude } },
      subAccountTeam: {
        include: { subAccount: { include: { agency: agencyInclude } } },
      },
    },
  });

  console.log({ foundUser });

  const NoAccount = ({ type }: { type: Role }) => {
    return (
      <div className="w-full h-[180px] bg-card flex flex-col items-center justify-center text-center p-4 rounded-md gap-y-2">
        <ShieldBan size={35} className="text-destructive" />
        <p className="text-muted-foreground">
          {type === "AGENCY_OWNER"
            ? "Agency Account"
            : type === "AGENCY_TEAM_MEMBER"
            ? "Agency Team Account"
            : type === "SUBACCOUNT_OWNER"
            ? "Sub Account"
            : type === "SUBACCOUNT_TEAM_MEMBER"
            ? "Sub Team Account"
            : ""}
        </p>
        <p className="text-destructive w-[80%]">
          Please Subscribe To View Your Agency
        </p>
      </div>
    );
  };

  if (!!foundUser && !!foundUser.id) {
    const { subAccount, agency, agencyTeam, subAccountTeam } = foundUser;

    const agencySubscription = agency?.planitAccount?.planitSubscription;
    const subSubscription =
      subAccount?.agency.planitAccount?.planitSubscription;
    const agencyTeamSubscription =
      agencyTeam?.agency.planitAccount?.planitSubscription;
    const subTeamSubscription =
      subAccountTeam?.subAccount.agency.planitAccount?.planitSubscription;

    return (
      <div className="p-4 space-y-6 w-full flex flex-col items-center justify-center">
        <Heading
          heading="Select Account to Access"
          description="You can access any of these account you belong to."
          center
        />

        <div className="grid w-full max-w-[1000px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 !mt-12">
          {!!agency ? (
            !!agencySubscription &&
            agencySubscription.subscriptionEndDate >= new Date() ? (
              <CardAccounts
                title="Agency Owner"
                description={agency.name}
                icon={Aperture}
                href={`${appLinks.agency}/${agency.id}`}
                className="w-full sm:max-w-[350px]"
              />
            ) : (
              <NoAccount type="AGENCY_OWNER" />
            )
          ) : null}
          {!!subAccount ? (
            !!subSubscription &&
            subSubscription.subscriptionEndDate >= new Date() ? (
              <CardAccounts
                title="Sub Account"
                description={subAccount.name}
                icon={CopyMinus}
                href={`${appLinks.subAccount}/${subAccount.id}`}
                className="w-full sm:max-w-[350px]"
              />
            ) : (
              <NoAccount type="SUBACCOUNT_OWNER" />
            )
          ) : null}
          {!!agencyTeam ? (
            !!agencyTeamSubscription &&
            agencyTeamSubscription.subscriptionEndDate >= new Date() ? (
              <CardAccounts
                title="Agency Team Account"
                description={agencyTeam.agency.name}
                icon={ShieldHalf}
                href={`${appLinks.agency}/${agencyTeam.agency.id}`}
                className="w-full sm:max-w-[350px]"
                disabled={!agencyTeam.access}
              />
            ) : (
              <NoAccount type="AGENCY_TEAM_MEMBER" />
            )
          ) : null}
          {!!subAccountTeam ? (
            !!subTeamSubscription &&
            subTeamSubscription.subscriptionEndDate >= new Date() ? (
              <CardAccounts
                title="Sub Team Account"
                description={subAccountTeam.subAccount.name}
                icon={ShieldHalf}
                href={`${appLinks.subAccount}/${subAccountTeam.subAccountId}`}
                className="w-full sm:max-w-[350px]"
                disabled={!subAccountTeam.access}
              />
            ) : (
              <NoAccount type="AGENCY_TEAM_MEMBER" />
            )
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[850px] p-4 space-y-6 mt-8">
        <Heading
          heading="Create An Agency"
          description="Please fill out the required fields"
          center
        />
        <AgencyDetails
          data={{ companyEmail: session.user.email as string }}
          isAgencyOwner={false}
        />
      </div>
    </div>
  );
};

export default AgencyPage;
