"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDisplayModal from "@/hooks/use-display-modal";
import { appLinks } from "@/lib/appLinks";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import CustomModal from "./custom-modal";
import FakePaymentForm from "../forms/fake-payment-form";

type Props = {
  session: Session | null;
  heading : string;
  description : string;
};

const PricingCardsComponent = ({ session, heading, description }: Props) => {
  const { setOpen } = useDisplayModal();
  const router = useRouter();

  return (
    <section className="flex justify-center items-center flex-col gap-4 mt-16 px-4">
      <Heading
        heading={heading}
        description={description}
        center
      />

      <div className="flex justify-center gap-4 flex-wrap mt-6 w-full">
        {pricingCards.map((card) => (
          <Card
            className={cn(
              "w-full sm:max-w-[300px] flex flex-col justify-between",
              {
                "border-2 border-primary": card.title === "Unlimited Saas",
              }
            )}
            key={card.title}
          >
            <CardHeader>
              <CardTitle
                className={cn("", {
                  "text-muted-foreground": card.title !== "Unlimited Saas",
                })}
              >
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-clampLg font-bold">${card.price}</span>
              <span>/ {card.duration}</span>
              <div className="text-sm text-muted-foreground">{card.highlight}</div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 ">
              {card.features.map((feature) => (
                <div key={feature} className="flex gap-2">
                  <Check />
                  <p>{feature}</p>
                </div>
              ))}
              <Button
                onClick={() => {
                  if (!session || !session.user) return router.push(appLinks.signIn);

                  setOpen(
                    <CustomModal
                      title={`Pay $${card.price} for our ${card.plan} Plan`}
                      subheading={`You are to pay $${card.price} for your subscription to be approved`}
                      className="max-w-[600px] h-auto"
                    >
                      <FakePaymentForm price={card.price} plan={card.plan} />
                    </CustomModal>
                  );
                }}
                className={cn("w-full text-center bg-primary p-2 rounded-md", {
                  "!bg-muted": card.title !== "Unlimited Saas",
                })}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingCardsComponent;
