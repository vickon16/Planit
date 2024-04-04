import { Prisma } from "@prisma/client";

export type TLoadingState = "idle" | "pending" | "fulfilled" | "rejected";

export type TFileUploadTypes =
  | "agencyLogo"
  | "avatar"
  | "subaccountLogo"
  | "media";

export type TPlanitAccounts = "agency" | "subAccount";

export type InvitationStatus = "ACCEPTED" | "REVOKED";

type userGetPayload = {
  include: {
    agencyTeam: true;
    subAccountTeam: true;
    agency: {
      include: { planitAccount: { include: { planitSubscription: true } } };
    };
    subAccount: true;
  };
}

export type TUserGetPayload = Prisma.UserGetPayload<userGetPayload>;

export type TInvitationGetPayload = Prisma.InvitationGetPayload<{
  include: { agency: true; subAccount: true; user: true };
}>;

export type TSubAccountGetPayload = Prisma.SubAccountGetPayload<{
  include: { user: true; agency: true };
}>;

export type TSubAccountTeamGetPayload = Prisma.SubAccountTeamGetPayload<{
  include: {
    user: userGetPayload;
    subAccount: true;
    tickets: true;
  };
}>;

export type TContactGetPayload = Prisma.ContactGetPayload<{
  include: { subAccount: true; tickets: true };
}>;

type ticketInclude = {
  include: { tags: true; contact: true; assigned: { include: { user: true } } };
};

export type TPipeLineGetPayload = Prisma.PipelineGetPayload<{
  include: {
    subAccount: true;
    lanes: { include: { tickets: ticketInclude } };
  };
}>;

export type TLaneGetPayload = Prisma.LaneGetPayload<{
  include: { tickets: ticketInclude };
}>;

export type TTicketsGetPayload = Prisma.TicketGetPayload<ticketInclude>;

export type TTagGetPayload = Prisma.TagGetPayload<{
  include: { ticket: true };
}>;

export type TFunnelGetPayload = Prisma.FunnelGetPayload<{
  include: { funnelPages: true; classNames: true };
}>;
