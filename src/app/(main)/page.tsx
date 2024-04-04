import { appLinks } from "@/lib/appLinks"
import { redirect } from "next/navigation"

const MainPage = () => redirect(appLinks.site);
export default MainPage