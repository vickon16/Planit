import { Role } from "@prisma/client";
import * as z from "zod";

const agencySubAccountMain = z.object({
  name: z.string().min(2),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  address: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  goal: z.number().optional(),
});

export const agencyFormSchema = agencySubAccountMain.merge(
  z.object({
    whiteLabel: z.boolean(),
    agencyLogo: z.string().min(1),
  })
);
export type TAgencyFormSchema = z.infer<typeof agencyFormSchema>;

export const subAccountFormSchema = agencySubAccountMain.merge(
  z.object({
    subAccountLogo: z.string().min(1),
  })
);

export type TSubAccountFormSchema = z.infer<typeof subAccountFormSchema>;

export const userDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string(),
});

export type TUserDataSchema = z.infer<typeof userDataSchema>;

export const userInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    Role.AGENCY_TEAM_MEMBER,
    Role.SUBACCOUNT_OWNER,
    Role.SUBACCOUNT_TEAM_MEMBER,
  ]),
});

export type TUserInvitationSchema = z.infer<typeof userInvitationSchema>;

export const fakePaymentFormSchema = z.object({
  companyEmail: z.string().email(),
  cardNumber: z
    .string()
    .min(1)
    .refine((value) => value === "0000 0000 0000 0000", {
      message: "Wrong Input, input did not match '0000 0000 0000 0000'",
    }),
  cvc: z.string().min(1).refine((value) => value === "000", {
    message: "Wrong Input, input did not match '000'",
  }),
  cardExpiration: z.string().min(1).refine((value) => value === "00/00", {
    message: "Wrong Input, input did not match '00/00'",
  }),
});

export type TFakePaymentFormSchema = z.infer<typeof fakePaymentFormSchema>;


export const mediaFormSchema = z.object({
  name : z.string().min(1),
  description : z.string().min(1),
  price : z.string().min(1),
  image : z.string().min(1),
});

export type TMediaFormSchema = z.infer<typeof mediaFormSchema>;


export const pipelineFormSchema = z.object({
  name : z.string().min(1),
  description : z.string().min(1),
});

export type TPipelineFormSchema = z.infer<typeof pipelineFormSchema>;


export const laneFormSchema = z.object({
  name : z.string().min(1),
});

export type TLaneFormSchema = z.infer<typeof laneFormSchema>;


export const ticketFormSchema = z.object({
  name : z.string().min(1),
  description : z.string().min(1).optional(),
  value : z.string().min(1),
  assignedId : z.string().min(1).optional(),
});

export type TTicketFormSchema = z.infer<typeof ticketFormSchema>;


export const tagFormSchema = z.object({
  name : z.string().min(1),
  color : z.string().min(1),
});

export type TTagFormSchema = z.infer<typeof tagFormSchema>;


export const funnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  subDomainName: z.string().min(1),
  favicon: z.string().optional(),
});

export type TFunnelFormSchema = z.infer<typeof funnelFormSchema>;

export const funnelPageFormSchema = z.object({
  name: z.string().min(1),
  pathName : z.string().optional(),
  order : z.number(),
  elements : z.string(),
});

export type TFunnelPageFormSchema = z.infer<typeof funnelPageFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(1),
  email : z.string().email(),
});

export type TContactFormSchema = z.infer<typeof contactFormSchema>;