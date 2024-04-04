
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appLinks } from "@/lib/appLinks";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: { agencyId: string };
};

const AgencyIdPage = async ({ params }: Props) => {
  const agency = await db.agency.findUnique({ where: { id: params.agencyId } });
  if (!agency) redirect(appLinks.agency);

  return <div className="relative h-full">{params.agencyId}</div>;
};

export default AgencyIdPage;
