import { appLinks } from "@/lib/appLinks";
import { redirect } from "next/navigation";

const SubAccountPage = async () => redirect(appLinks.agency)
export default SubAccountPage;
