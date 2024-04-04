import CreateSubAccountButton from "@/components/global/create-subaccount-button";
import Heading from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { columns } from "./columns";

type Props = {
  params: { agencyId: string };
};

const SubAccountsPage = async ({ params }: Props) => {
  const allSubAccounts = await db.subAccount.findMany({
    where: { agencyId: params.agencyId },
    include: { agency: true, user: true },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4 justify-between my-6">
        <Heading
          heading="All SubAccounts"
          description="All the sub-accounts that belongs to this agency are here"
        />
        <CreateSubAccountButton
          agencyId={params.agencyId}
          subAccountData={{ agencyId: params.agencyId }}
        />
      </div>

      <Separator />

      <DataTable
        searchKeys={[
          {
            id: "1",
            key: "name",
            type: "input",
          },
          {
            id: "2",
            key: "companyEmail",
            type: "input",
          },
        ]}
        showPagination
        columns={columns}
        data={allSubAccounts}
      />
    </section>
  );
};

export default SubAccountsPage;
