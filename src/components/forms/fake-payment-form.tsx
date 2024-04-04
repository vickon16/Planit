"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader
} from "../ui/card";

import useDisplayModal from "@/hooks/use-display-modal";
import { subscribeToPlanit } from "@/lib/queries";
import {
  TFakePaymentFormSchema,
  fakePaymentFormSchema
} from "@/lib/zodSchemas";
import { SubscriptionPlan } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import CustomForm from "./custom-form";
import { appLinks } from "@/lib/appLinks";

type Props = {
  price: number;
  plan: SubscriptionPlan;
};

const FakePaymentForm = ({ price, plan }: Props) => {
  const { setClose } = useDisplayModal();
  const router = useRouter();

  const form = useForm<TFakePaymentFormSchema>({
    resolver: zodResolver(fakePaymentFormSchema),
    defaultValues: {
      companyEmail: "",
      cardNumber: "",
      cvc: "",
      cardExpiration: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TFakePaymentFormSchema) => {
    try {
      console.log(values)
      await subscribeToPlanit(values.companyEmail, price, plan);
      toast.success("Subscription successfully!.");
      router.push(appLinks.subscriptionPlan);
      router.refresh();
      setClose();
    } catch (error) {
      toast.error(error instanceof Error ?  error.message : "Failed to update user details");
      console.log(error);
    }
  };

  return (
    <Card className="w-full space-y-4">
      <CardHeader>
        <p className="text-muted-foreground">
          Please input the value 0 in all the card detail fields to fake this
          payment
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomForm
              form={form}
              type="text"
              name="companyEmail"
              disabled={isLoading}
              formLabel="Your Company Email"
              placeholder="Email..."
              isRequired
            />

            <CustomForm
              form={form}
              type="text"
              name="cardNumber"
              disabled={isLoading}
              formLabel="Your Card Number"
              placeholder="eg. 0000 0000 0000 0000"
              formDescription="Please, pass in the value '0000 0000 0000 0000' to approve this payment"
              isRequired
            />

            <div className="flex items-center gap-3 max-sm:flex-wrap">
              <CustomForm
                form={form}
                type="text"
                name="cvc"
                formLabel="CVC"
                placeholder="000"
                formDescription="Please, pass in the value '000' to approve this payment"
                isRequired
              />

              <CustomForm
                form={form}
                type="text"
                name="cardExpiration"
                formLabel="Card Expiration"
                placeholder="00/00"
                formDescription="Please, pass in the value '00/00' to approve this payment"
                isRequired
              />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full !mt-8">Pay ${price}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FakePaymentForm;
