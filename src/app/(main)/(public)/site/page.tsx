import Footer from "@/components/footer";
import PricingCardsComponent from "@/components/global/pricing-cards-component";
import Navbar from "@/components/navbar";
import { getCustomSession } from "@/lib/auth-actions";

import { cn, zPriority } from "@/lib/utils";
import Image from "next/image";

const SitePage = async () => {
  const session = await getCustomSession();

  return (
    <>
      <section className="h-full w-full md:pt-24 mt-[70px] px-4 relative flex items-center justify-center flex-col">
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#dcdcdcaa_1px,transparent_1px),linear-gradient(to_bottom,#dcdcdcaa_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#3636368a_1px,transparent_1px),linear-gradient(to_bottom,#3636368a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_50%,transparent_110%)]",
            zPriority.pr_1
          )}
        />

        <p className="text-center text-clampMd text-foreground/80">
          Run your agency, in one place
        </p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="!text-clampHero font-bold text-center uppercase">
            Planit
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-60px]">
          <Image
            src={"/assets/preview.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div
            className={cn(
              "bottom-0 top-[40%] bg-gradient-to-t from-background left-0 right-0 absolute",
              zPriority.pr1
            )}
          ></div>
        </div>
      </section>

      <PricingCardsComponent
        session={session}
        heading="Choose what fits you right"
        description="Our straightforward pricing plans are tailored to meet your needs. If you're not ready to commit you can get started for free."
      />
    </>
  );
};

export default SitePage;
