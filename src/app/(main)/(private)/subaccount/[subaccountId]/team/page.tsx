import { db } from "@/lib/db";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Heading from "@/components/heading";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { subaccountId: string };
};

const TeamPage = async ({ params }: Props) => {
  const teamMembers = await db.subAccountTeam.findMany({
    where: { subAccountId: params.subaccountId },
    include: {
      subAccount: true,
      tickets: true,
      user: {
        include: {
          agencyTeam: true,
          subAccountTeam: true,
          agency: {
            include: {
              planitAccount: { include: { planitSubscription: true } },
            },
          },
          subAccount: true,
        },
      },
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Heading
          heading="SubAccount Team Members"
          description="Shows list of our subAccount team members and their access permissions"
        />
        <SendInvitation type="subAccount" accountId={params.subaccountId} />
      </div>

      <DataTable
        searchKeys={[
          {
            id: "1",
            key: "name",
            type: "input",
          },
          {
            id: "2",
            key: "email",
            type: "input",
          },
        ]}
        showPagination
        columns={columns}
        data={teamMembers}
      />
    </section>
  );
};

export default TeamPage;
