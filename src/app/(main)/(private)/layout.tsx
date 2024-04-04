import Navbar from "@/components/navbar";
import { PropsWithChildren } from "react";

const PrivateLayout = ({children} : PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className="!pt-[80px] min-h-screen h-full w-full">{children}</main>
    </>
  );
};

export default PrivateLayout;
