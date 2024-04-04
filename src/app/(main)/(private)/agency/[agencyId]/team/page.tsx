import { db } from "@/lib/db";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Heading from "@/components/heading";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const teamMembers = await db.user.findMany({
    where: { agencyTeam: { agencyId: params.agencyId } },
    include: {
      agency: {
        include: { planitAccount: { include: { planitSubscription: true } } },
      },
      agencyTeam: true,
      subAccount: true,
      subAccountTeam : true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Heading
          heading="Agency Team Members"
          description="Shows list of our agency team members and their access permissions"
        />
        <SendInvitation type="agency" accountId={params.agencyId} />
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
