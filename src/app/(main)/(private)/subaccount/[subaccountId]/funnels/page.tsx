import Heading from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { columns } from "./columns";
import CreateFunnelButton from "@/components/global/create-funnel-button";

type Props = {
  params: { subaccountId: string };
};

const FunnelsPage = async ({ params }: Props) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: params.subaccountId },
    include : { funnelPages : true, classNames : true}
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Heading
          heading="Your Funnels"
          description="Shows list of your subaccount funnels."
        />
        <CreateFunnelButton subAccountId={params.subaccountId} />
      </div>

      <DataTable
        searchKeys={[
          {
            id: "1",
            key: "name",
            type: "input",
          },
        ]}
        showPagination
        columns={columns}
        data={funnels || []}
      />
    </section>
  );
};

export default FunnelsPage;
