import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { PropsWithChildren } from "react";

const SiteLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className="mt-[70px] w-full">{children}</main>
      <Footer />
    </>
  );
};

export default SiteLayout;
