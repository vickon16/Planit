import Heading from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { columns } from "./columns";

type Props = {
  params: { subaccountId: string }
}

const ContactsPage = async ({ params }: Props) => {

  const contacts = await db.contact.findMany({
    where : {subAccountId : params.subaccountId},
    include : {subAccount : true, tickets : true}
 })

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Heading
          heading="Contact Leads"
          description="Shows all subAccount contact leads information."
        />
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
        data={contacts}
      />
    </section>
  );
};

export default ContactsPage;
