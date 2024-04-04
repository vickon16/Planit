import CancelSubscription from "@/components/global/cancel-subscription";
import PricingCardsComponent from "@/components/global/pricing-cards-component";
import Heading from "@/components/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appLinks } from "@/lib/appLinks";
import { getCurrentUser, getCustomSession } from "@/lib/auth-actions";
import { pricingCards } from "@/lib/constants";
import { redirect } from "next/navigation";

const SubscriptionPlan = async () => {
  const session = await getCustomSession();
  if (!session || !session.user) redirect(appLinks.signIn);

  const user = await getCurrentUser(session.user.id);
  if (!user) return redirect(appLinks.site);

  const agencyPlanitAccount = user.agency?.planitAccount

  if (!user.agency || !agencyPlanitAccount?.planitSubscription) {
    return (
      <div className="pt-10 w-full text-center">
        <p className="text-clampMd text-destructive font-semibold border p-2">
          No Subscription found
        </p>
        <PricingCardsComponent
          session={session}
          heading="Subscribe to Planit"
          description="Your subscription is monthly and would expire when the month runs out"
        />
      </div>
    );
  }

  const currentPlan = agencyPlanitAccount.planitSubscription.plan;

  const mappedPlan = pricingCards.find((card) => card.plan === currentPlan)!;

  return (
    <section className="container !mt-6 space-y-10">
      <Heading
        heading="Subscribe to Planit"
        description="Your subscription is monthly and would expire when the month runs out"
      />

      <div className="flex flex-col sm:flex-row gap-8 w-full">
        <Card className="w-fit">
          <CardHeader>
            <CardTitle className="text-clampMd flex gap-x-2 items-center">
              Current Plan :{" "}
              <span className="p-2 border rounded-md">{mappedPlan.plan}</span>
            </CardTitle>
            <CardDescription>{mappedPlan?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-clampLg font-bold ">
              {mappedPlan.price}/
              <span className="text-sm">{mappedPlan.duration}</span>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-clampSm text-muted-foreground">Plan Features</h2>
          <ul className="list-disc !m-0 !p-0 !mt-4 !ml-6 space-y-2">
            {mappedPlan.features.map((feature, index) => (
              <li key={feature + index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="sm:ml-auto">
          <CancelSubscription
            agencyId={user.agency.id}
            subscriptionId={agencyPlanitAccount.planitSubscription.id}
          />
        </div>
      </div>

      <PricingCardsComponent
        session={session}
        heading="Change Plan Or Upgrade to a better Plan"
        description="Our straightforward pricing plans are tailored to meet your needs. If you want to change the plan, feel free to."
      />
    </section>
  );
};

export default SubscriptionPlan;
