import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Unauthorized from "@/components/global/unauthorized";
import FunnelEditor from "@/components/editor/funnel-editor";

type Props = {
  params: {
    domain: string;
  };
};

const DomainPage = async ({ params }: Props) => {

  const funnel = await db.funnel.findUnique({
    where: { subDomainName : params.domain },
    include: { funnelPages: true },
  });

  if (!funnel) return notFound();

  // find the index page
  const pageData = funnel.funnelPages.find((page) => page.pathName === "");

  if (!pageData)
    return (
      <Unauthorized
        heading='You failed to create a home page with pathname "/" for your website'
        description="Please Go back and create it to access this page"
      />
    );

  await db.funnelPage.update({
    where: { id: pageData.id},
    data: { visits: { increment: 1},
    },
  });

  return <FunnelEditor liveMode />;
};

export default DomainPage;
