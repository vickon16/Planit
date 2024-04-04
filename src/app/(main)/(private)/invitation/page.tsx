import EmptyComponent from "@/components/empty-component";
import { db } from "@/lib/db";
import InvitationPageClient from "./components/invitation-page-client";

type Props = {
  searchParams: {
    invitationId: string;
  };
};

const InvitationPage = async ({ searchParams }: Props) => {
  const invitation = await db.invitation.findUnique({
    where: { id: searchParams.invitationId },
    include: { agency: true, subAccount  : true, user : true },
  });

  if (!invitation)
    return (
      <div className="p-4 text-center h-[60svh] w-full flex justify-center items-center flex-col">
        <EmptyComponent
          heading="No Invitation Found"
          description="You didn't get any invitation to access this page"
          center
          icon
        />
      </div>
    );

  return <InvitationPageClient invitation={invitation} />;
};

export default InvitationPage;
