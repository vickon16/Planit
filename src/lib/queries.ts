"use server";

import {
  Agency,
  FunnelPage,
  Invitation,
  Lane,
  SubAccount,
  SubscriptionPlan,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { appLinks } from "./appLinks";
import { getCustomSession } from "./auth-actions";
import { db } from "./db";
import { InvitationStatus, TPlanitAccounts } from "./types";
import {
  TAgencyFormSchema,
  TContactFormSchema,
  TFunnelFormSchema,
  TFunnelPageFormSchema,
  TLaneFormSchema,
  TMediaFormSchema,
  TPipelineFormSchema,
  TSubAccountFormSchema,
  TTicketFormSchema,
  TUserInvitationSchema,
} from "./zodSchemas";
import { defaultPageElement } from "./constants";

const checkSession = async () => {
  const session = await getCustomSession();
  if (!session || !session.user) redirect(appLinks.signIn);
  return session.user;
};

export const sendInvitation = async (
  type: TPlanitAccounts,
  accountId: string,
  invitationData: TUserInvitationSchema
) => {
  const user = await checkSession();
  const { email, role } = invitationData;

  const invitedUser = await db.user.findFirst({
    where: { email },
  });

  if (!invitedUser)
    throw new Error(
      "This user is not in the database, Please do well to inform them to create their account"
    );

  if (invitedUser.email === user.email)
    throw new Error("You cannot send invitation to yourself");

  if (type === "subAccount" && role === "SUBACCOUNT_TEAM_MEMBER") {
    const subAccountUser = await db.subAccountTeam.findFirst({
      where: { subAccountId: accountId, userId: invitedUser.id },
    });

    if (subAccountUser)
      throw new Error("This user is already a sub account user");

    // check if user is already invited
    const isUserInvitation = await db.invitation.findFirst({
      where: { userId: invitedUser.id, role, subAccountId: accountId },
    });

    if (isUserInvitation) throw new Error("This user is already invited");

    const newInvitation = await db.invitation.create({
      data: {
        subAccountId: accountId,
        role: invitationData.role,
        userId: invitedUser.id,
      },
      include: { agency: true, subAccount: true },
    });

    if (!newInvitation.subAccount) throw new Error("Bad Request");

    await db.notification.create({
      data: {
        notification: `${user.name} | Agency ${newInvitation.subAccount?.name} has Successfully Invited ${invitedUser.email} to join as ${role}.`,
        agencyId: newInvitation.subAccount.agencyId,
        subAccountId: newInvitation.subAccount.id,
      },
    });

    revalidatePath(appLinks.subAccount);
    return;
  }

  if (type === "agency") {
    if (role === "AGENCY_TEAM_MEMBER") {
      const agencyTeamUser = await db.agencyTeam.findFirst({
        where: { agencyId: accountId, userId: invitedUser.id },
      });

      if (agencyTeamUser) throw new Error("This user is already a team member");
    }

    if (role === "SUBACCOUNT_OWNER") {
      const subAccountUser = await db.subAccount.findFirst({
        where: { agencyId: accountId, userId: invitedUser.id },
      });

      if (subAccountUser)
        throw new Error("This user is already a sub account user");
    }

    // check if user is already invited
    const isUserInvitation = await db.invitation.findFirst({
      where: { userId: invitedUser.id, role, agencyId: accountId },
    });

    if (isUserInvitation) throw new Error("This user is already invited");

    const newInvitation = await db.invitation.create({
      data: {
        agencyId: accountId,
        role: invitationData.role,
        userId: invitedUser.id,
      },
      include: { agency: true },
    });

    if (!newInvitation.agency) throw new Error("Bad Request");

    await db.notification.create({
      data: {
        notification: `${user.name} | Agency ${newInvitation.agency.name} has Successfully Invited ${invitedUser.email} to join as ${role}.`,
        agencyId: newInvitation.agency.id,
      },
    });

    revalidatePath(appLinks.agency);
  }
};

export const acceptRevokeInvitation = async (
  invitation: Invitation,
  action: InvitationStatus
) => {
  const user = await checkSession();

  const invitationData = await db.invitation.findFirst({
    where: { id: invitation.id, userId: user.id },
    include: { agency: true, subAccount: true, user: true },
  });

  if (!invitationData) throw new Error("Invitation not found");

  const role = invitationData.role;

  if (action === "ACCEPTED") {
    if (role === "AGENCY_OWNER") {
      throw new Error(`This invitation to join as ${role} is not allowed`);
    }

    if (role === "AGENCY_TEAM_MEMBER") {
      if (!invitationData.agency)
        throw new Error("We couldn't find any agency");

      const newTeamMember = await db.agencyTeam.create({
        data: {
          agencyId: invitationData.agency.id,
          userId: invitationData.userId,
          access: true,
        },
        include: { user: true },
      });

      await db.$transaction([
        db.invitation.delete({ where: { id: invitationData.id } }),
        db.notification.create({
          data: {
            notification: `${user.name} | Agency ${invitationData.agency.name} has Successfully Invited ${newTeamMember.user.name} to the team as ${role}.`,
            agencyId: invitationData.agency.id,
          },
        }),
      ]);
    }

    if (role === "SUBACCOUNT_TEAM_MEMBER") {
      if (!invitationData.subAccount)
        throw new Error("We couldn't find any subaccount");

      const newTeamMember = await db.subAccountTeam.create({
        data: {
          subAccountId: invitationData.subAccount.id,
          userId: invitationData.userId,
          access: true,
        },
        include: { user: true },
      });

      await db.$transaction([
        db.invitation.delete({ where: { id: invitationData.id } }),
        db.notification.create({
          data: {
            notification: `${user.name} | SubAccount ${invitationData.subAccount.name} has Successfully Invited ${newTeamMember.user.name} to the team as ${role}.`,
            agencyId: invitationData.subAccount.agencyId,
            subAccountId: invitationData.subAccount.id,
          },
        }),
      ]);
    }

    if (role === "SUBACCOUNT_OWNER") {
      if (!invitationData.agency)
        throw new Error("We couldn't find any agency");

      const newSubAccount = await db.subAccount.create({
        data: {
          agencyId: invitationData.agency.id,
          goal: invitationData.agency.goal,
          userId: user.id,
          companyEmail: "",
          address: "",
          country: "",
          state: "",
          city: "",
          companyPhone: "",
          zipCode: "",
          name: "",
          subAccountLogo: "",
        },
      });

      await db.$transaction([
        db.invitation.delete({ where: { id: invitationData.id } }),
        db.notification.create({
          data: {
            notification: `${user.name} | Agency ${invitationData.agency.name} has Successfully Invited ${invitationData.user.email} to the team.`,
            agencyId: newSubAccount.agencyId,
            subAccountId: newSubAccount.id,
          },
        }),
      ]);
    }
  }

  if (action === "REVOKED") {
    await db.invitation.delete({
      where: { id: invitationData.id },
    });
  }

  revalidatePath(appLinks.agency);
};

// CRUD User
export const updateUser = async (
  userId: string,
  userDetails: Partial<User>
) => {
  await checkSession();

  await db.user.update({
    where: { id: userId },
    data: userDetails,
  });
};

// CRUD Agency
export const createAgency = async (agency: TAgencyFormSchema) => {
  const user = await checkSession();
  const id = v4();

  const newAgency = await db.agency.create({
    data: {
      ...agency,
      id,
      goal: Boolean(Number(agency?.goal)) ? agency.goal! : 1,
      userId: user.id,
      planitAccount: {
        create: {},
      },
    },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency ${newAgency.name} was created`,
      agencyId: newAgency.id,
    },
  });

  revalidatePath(appLinks.agency);
};

export const updateAgency = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const user = await checkSession();
  if (!agencyId) return null;

  const updatedAgency = await db.agency.update({
    where: { id: agencyId },
    data: agencyDetails,
    include: { user: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency ${updatedAgency.name} was currently updated.`,
      agencyId: updatedAgency.id,
    },
  });

  revalidatePath(appLinks.agency);
};

export const deleteAgency = async (agencyId: string) => {
  const user = await checkSession();

  await db.agency.delete({
    where: {
      id: agencyId,
      userId: user.id,
    },
  });

  revalidatePath(appLinks.agency);
};

// CRUD SubAccount
export const createSubAccount = async (
  agencyId: string,
  subAccount: TSubAccountFormSchema
) => {
  const user = await checkSession();
  if (!agencyId) return null;

  if (subAccount.companyEmail === user.email)
    throw new Error("Company Email for subAccount must vary from agency email");

  // check if user exists in the database
  const toBeCreatedUser = await db.user.findFirst({
    where: { email: subAccount.companyEmail },
  });

  if (!toBeCreatedUser)
    throw new Error(
      "This user is not in the database, Please do well to inform them to create their account"
    );

  const isSubAccountExists = await db.subAccount.findFirst({
    where: { userId: user.id, agencyId },
  });

  if (isSubAccountExists)
    throw new Error("This subaccount email already exists");

  const id = v4();

  const newSubAccount = await db.subAccount.create({
    data: {
      ...subAccount,
      id,
      goal: Boolean(Number(subAccount?.goal)) ? subAccount.goal! : 1,
      agencyId,
      userId: toBeCreatedUser.id,
    },
    include: { agency: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Sub Account ${newSubAccount.name} was created by Agency ${newSubAccount.agency.name}`,
      agencyId: newSubAccount.agencyId,
      subAccountId: newSubAccount.id,
    },
  });

  revalidatePath(appLinks.subAccount);
};

export const updateSubAccount = async (
  subAccountId: string,
  subAccountDetails: Partial<SubAccount>
) => {
  const user = await checkSession();
  if (!subAccountId) return null;

  const updatedSubAccount = await db.subAccount.update({
    where: { id: subAccountId },
    data: subAccountDetails,
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Sub Account ${updatedSubAccount.name} was currently updated.`,
      agencyId: updatedSubAccount.agencyId,
      subAccountId: updatedSubAccount.id,
    },
  });

  revalidatePath(appLinks.subAccount);
};

export const deleteSubAccount = async (subAccountId: string) => {
  const user = await checkSession();

  const subAccount = await db.subAccount.delete({
    where: { id: subAccountId },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Sub Account ${subAccount.name} was currently deleted.`,
      agencyId: subAccount.agencyId,
    },
  });

  revalidatePath(appLinks.subAccount);
};

export const checkSubAccountSubscription = async (subAccountId: string) => {
  const user = await checkSession();

  const subAccount = await db.subAccount.findUnique({
    where: {
      id: subAccountId,
      OR: [
        // give access to the owner or the subaccount
        { userId: user.id },
        // give access to the agency owner
        { agency: { userId: user.id } },
        // give access to the agency team member with access
        {
          agency: {
            agencyTeams: { some: { userId: user.id, access: true } },
          },
        },
        // give access to the subAccount team member with access
        {
          subAccountTeam: { some: { userId: user.id, access: true } },
        },
      ],
    },
    include: {
      user: true,
      agency: {
        include: { planitAccount: { include: { planitSubscription: true } } },
      },
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!subAccount) redirect(appLinks.agency);
  const subPlanitAccount = subAccount.agency.planitAccount;

  let subAccountAccess = true;

  // a subaccount user should not have access when their agency is not subscribed
  if (
    !subPlanitAccount?.planitSubscription ||
    subPlanitAccount.planitSubscription.subscriptionEndDate < new Date()
  )
    subAccountAccess = false;

  return { subAccount, user, subAccountAccess };
};

// Crud AgencyTeam
export const updateAgencyTeamAccess = async (
  userId: string,
  agencyId: string,
  access: boolean
) => {
  const user = await checkSession();

  const newAccess = await db.agencyTeam.update({
    where: { userId, agencyId },
    data: { access },
    include: { user: true, agency: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency ${newAccess.agency.name} has updated User ${newAccess.user.email} Team Access`,
      agencyId,
    },
  });

  revalidatePath(appLinks.agency);
};

export const deleteAgencyTeamMember = async (agencyTeamMemberId: string) => {
  const user = await checkSession();

  const deletedTeamMember = await db.agencyTeam.delete({
    where: { userId: agencyTeamMemberId },
    include: { user: true, agency: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency Team Member Account ${deletedTeamMember.user.email} was currently deleted.`,
      agencyId: deletedTeamMember.agencyId,
    },
  });

  revalidatePath(appLinks.agency);
};

// Crud SubAccountTeam

export const getSubAccountTeamMembers = async (subAccountId: string) => {
  await checkSession();

  const subAccountTeamMembers = await db.subAccountTeam.findMany({
    where: { subAccountId },
    include: { user: true, subAccount: true },
  });

  return subAccountTeamMembers;
};

export const updateSubAccountTeamAccess = async (
  userId: string,
  subAccountId: string,
  access: boolean
) => {
  const user = await checkSession();

  const newAccess = await db.subAccountTeam.update({
    where: { userId, subAccountId },
    data: { access },
    include: { user: true, subAccount: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency ${newAccess.subAccount.name} has updated User ${newAccess.user.email} Team Access`,
      agencyId: newAccess.subAccount.agencyId,
      subAccountId: newAccess.subAccount.id,
    },
  });

  revalidatePath(appLinks.subAccount);
};

export const deleteSubAccountTeamMember = async (
  subAccountTeamMemberId: string
) => {
  const user = await checkSession();

  const deletedTeamMember = await db.subAccountTeam.delete({
    where: { userId: subAccountTeamMemberId },
    include: { user: true, subAccount: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Agency Team Member Account ${deletedTeamMember.user.email} was currently deleted.`,
      agencyId: deletedTeamMember.subAccount.agencyId,
      subAccountId: deletedTeamMember.subAccount.id,
    },
  });

  revalidatePath(appLinks.subAccount);
};

// Planit Account
export const subscribeToPlanit = async (
  companyEmail: string,
  price: number,
  plan: SubscriptionPlan
) => {
  const user = await checkSession();

  const agency = await db.agency.findUnique({
    where: { companyEmail, userId: user.id },
    include: { planitAccount: { include: { planitSubscription: true } } },
  });

  if (!agency)
    throw new Error(
      "Agency with this email address does not exist. You might not also be the owner of this agency. Please create one"
    );

  const newSubscriptionEndDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  if (!agency.planitAccount) return null;

  if (agency.planitAccount.planitSubscription) {
    await db.$transaction([
      db.planitSubscription.update({
        where: { id: agency.planitAccount.planitSubscription.id },
        data: { plan, price, subscriptionEndDate: newSubscriptionEndDate },
      }),
      db.notification.create({
        data: {
          notification: `${user.name} | Agency ${agency.name} has just updated their Planit's subscription plan to ${plan} for $${price}`,
          agencyId: agency.id,
        },
      }),
    ]);
  } else {
    await db.$transaction([
      db.planitSubscription.create({
        data: {
          planitAccountId: agency.planitAccount.id,
          plan,
          price,
          subscriptionEndDate: newSubscriptionEndDate,
        },
      }),
      db.notification.create({
        data: {
          notification: `${user.name} | Agency ${agency.name} has just subscribed to Planit's ${plan} plan for $${price}`,
          agencyId: agency.id,
        },
      }),
    ]);
  }

  revalidatePath(appLinks.agency);
  revalidatePath(appLinks.subscriptionPlan);
};

export const cancelSubscription = async (
  subscriptionId: string,
  agencyId: string
) => {
  const user = await checkSession();

  const agency = await db.agency.findUnique({
    where: {
      id: agencyId,
      userId: user.id,
      planitAccount: { planitSubscription: { id: subscriptionId } },
    },
  });

  if (!agency)
    throw new Error("Agency or Subscription does not exist. Please create one");

  await db.$transaction([
    db.planitSubscription.delete({ where: { id: subscriptionId } }),
    db.notification.create({
      data: {
        notification: `${user.name} | Agency ${agency.name} has canceled their subscription.`,
        agencyId,
      },
    }),
  ]);
};

// Media

export const getMedia = async (type: TPlanitAccounts, accountId: string) => {
  if (!accountId) return;

  let media;

  if (type === "agency") {
    const agency = await db.agency.findUnique({
      where: { id: accountId },
      include: { planitAccount: { include: { planitMedia: true } } },
    });

    media = agency?.planitAccount?.planitMedia;
  } else {
    const subAccount = await db.subAccount.findUnique({
      where: { id: accountId },
      include: {
        agency: {
          include: { planitAccount: { include: { planitMedia: true } } },
        },
      },
    });

    media = subAccount?.agency.planitAccount?.planitMedia?.filter(
      (media) => media.mediaType === "SUBACCOUNT_MEDIA"
    );
  }

  return media;
};

export const createMedia = async (
  type: TPlanitAccounts,
  accountId: string,
  values: TMediaFormSchema
) => {
  const user = await checkSession();

  if (type === "agency") {
    const agency = await db.agency.findFirst({
      where: { id: accountId },
      include: { planitAccount: true },
    });

    if (!agency || !agency.planitAccount)
      throw new Error("Agency Account does not exist.");

    await db.$transaction([
      db.planitMedia.create({
        data: {
          ...values,
          price: Number(values.price) || 0,
          planitAccountId: agency.planitAccount.id,
          mediaType: "AGENCY_MEDIA",
        },
      }),
      db.notification.create({
        data: {
          notification: `${user.name} | A new product has been created`,
          agencyId: agency.id,
        },
      }),
    ]);
  } else if (type === "subAccount") {
    const subAccount = await db.subAccount.findFirst({
      where: { id: accountId },
      include: { agency: { include: { planitAccount: true } } },
    });

    if (!subAccount || !subAccount.agency.planitAccount)
      throw new Error("SubAccount Account does not exist.");

    await db.$transaction([
      db.planitMedia.create({
        data: {
          ...values,
          price: Number(values.price) || 0,
          planitAccountId: subAccount.agency.planitAccount.id,
          mediaType: "SUBACCOUNT_MEDIA",
        },
      }),
      db.notification.create({
        data: {
          agencyId: subAccount.agencyId,
          notification: `${user.name} | A new product has been created`,
          subAccountId: subAccount.id,
        },
      }),
    ]);
  }
};

export const deleteMedia = async (mediaId: string) => {
  await checkSession();
  await db.planitMedia.delete({ where: { id: mediaId }, include: {} });
};

// Contact

export const getContacts = async (subAccountId: string) => {
  await checkSession();

  const contacts = await db.contact.findMany({
    where: { subAccountId },
    include: { subAccount: true },
  });

  return contacts;
};

export const addContact = async (
  subAccountId: string,
  contactDetails: TContactFormSchema
) => {
  const user = await checkSession();

  const contact = await db.contact.findFirst({
    where: { subAccountId },
  });

  if (!contact) {
    const newContact = await db.contact.create({
      data: {
        ...contactDetails,
        subAccountId,
      },
      include: { subAccount: true },
    });

    await db.notification.create({
      data: {
        notification: `${user.name} | Contact lead ${contactDetails.email} has joined us`,
        agencyId: newContact.subAccount.agencyId,
        subAccountId: newContact.subAccount.id,
      },
    });
  } else {
    await db.contact.update({
      where: { id: contact.id },
      data: contactDetails,
    });
  }
};

export const deleteContact = async (contactId: string) => {
  const user = await checkSession();
  const contact = await db.contact.delete({
    where: { id: contactId },
    include: { subAccount: true },
  });

  await db.notification.create({
    data: {
      notification: `${user.name} | Contact lead ${contact.email} has been deleted`,
      agencyId: contact.subAccount.agencyId,
      subAccountId: contact.subAccount.id,
    },
  });
};

// Pipeline

export const createPipeline = async (
  subAccountId: string,
  values: TPipelineFormSchema
) => {
  const user = await checkSession();

  const subAccount = await db.subAccount.findFirst({
    where: { id: subAccountId },
  });

  if (!subAccount) throw new Error("SubAccount Account does not exist.");

  await db.$transaction([
    db.pipeline.create({
      data: { ...values, subAccountId },
    }),
    db.notification.create({
      data: {
        agencyId: subAccount.agencyId,
        notification: `${user.name} | A new pipeline ${values.name} has been created for subAccount ${subAccount.name}`,
        subAccountId: subAccount.id,
      },
    }),
  ]);
};

export const updatePipeline = async (
  pipelineId: string,
  values: TPipelineFormSchema
) => {
  await checkSession();
  await db.pipeline.update({ where: { id: pipelineId }, data: values });
};

export const deletePipeline = async (pipelineId: string) => {
  await checkSession();
  await db.pipeline.delete({ where: { id: pipelineId } });
};

// Lane

export const createLane = async (
  pipelineId: string,
  values: TLaneFormSchema
) => {
  await checkSession();

  const pipeline = await db.pipeline.findUnique({
    where: { id: pipelineId },
    include: { lanes: true },
  });

  if (!pipeline) throw new Error("Pipeline does not exist.");

  await db.lane.create({
    data: { ...values, pipelineId, order: pipeline.lanes.length },
  });
};

export const updateLane = async (laneId: string, values: TLaneFormSchema) => {
  await checkSession();
  await db.lane.update({ where: { id: laneId }, data: values });
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTransaction = lanes.map((lane) =>
      db.lane.update({
        where: { id: lane.id },
        data: { order: lane.order },
      })
    );

    await db.$transaction(updateTransaction);
  } catch (error) {
    console.log(error, "ERROR UPDATE LANES ORDER");
  }
};

export const deleteLane = async (laneId: string) => {
  await checkSession();
  await db.lane.delete({ where: { id: laneId } });
};

// Ticket

export const createTicket = async (
  laneId: string,
  values: TTicketFormSchema,
  tags: Tag[]
) => {
  await checkSession();

  const lane = await db.lane.findUnique({
    where: { id: laneId },
  });

  if (!lane) throw new Error("Ticket does not exist.");

  const newTicket = await db.ticket.create({
    data: {
      ...values,
      value: Number(values.value) || 0,
      laneId,
    },
  });

  await db.tag.createMany({
    data: tags.map((tag) => ({ ...tag, ticketId: newTicket.id })),
  });
};

export const updateTicket = async (
  ticketId: string,
  values: TTicketFormSchema,
  tags: Tag[]
) => {
  await checkSession();
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: { tags: true },
  });

  if (!ticket) throw new Error("Ticket does not exist.");
  const newTags = tags.map((tag) => ({ ...tag, ticketId }));

  await db.$transaction([
    db.tag.deleteMany({ where: { ticketId } }),
    db.tag.createMany({ data: newTags }),
    db.ticket.update({
      where: { id: ticketId },
      data: {
        ...values,
        value: Number(values.value) || 0,
      },
    }),
  ]);
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTransaction = tickets.map((ticket) =>
      db.ticket.update({
        where: { id: ticket.id },
        data: { order: ticket.order, laneId: ticket.laneId },
      })
    );

    await db.$transaction(updateTransaction);
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE TICKET ORDER");
  }
};

export const deleteTicket = async (ticketId: string) => {
  await checkSession();
  await db.ticket.delete({ where: { id: ticketId } });
};

// Tag

// Funnel

export const getFunnel = async (funnelId : string) => {
  const funnel = await db.funnel.findUnique({
    where : {id : funnelId},
    include : {funnelPages : {orderBy : {order : "asc"}}}
  })

  return funnel;
} 

export const createFunnel = async (
  subAccountId: string,
  values: TFunnelFormSchema
) => {
  const user = await checkSession();

  const subAccount = await db.subAccount.findUnique({
    where: { id: subAccountId },
  });

  if (!subAccount) throw new Error("SubAccount does not exists.");

  await db.$transaction([
    db.funnel.create({
      data: { ...values, subAccountId },
    }),
    db.notification.create({
      data: {
        agencyId: subAccount.agencyId,
        notification: `${user.name} | A new funnel ${values.name} has been created for subAccount ${subAccount.name}`,
        subAccountId: subAccount.id,
      },
    }),
  ]);
};

export const updateFunnel = async (
  funnelId: string,
  values: TFunnelFormSchema
) => {
  await checkSession();
  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
  });

  if (!funnel) throw new Error("Funnel does not exist.");

  await db.funnel.update({
    where: { id: funnelId },
    data: values,
  });
};

export const deleteFunnel = async (funnelId: string) => {
  await checkSession();
  await db.funnel.delete({ where: { id: funnelId } });
};

// Funnel Page
export const createFunnelPage = async (
  funnelId: string,
  values: TFunnelPageFormSchema
) => {
  await checkSession();

  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
  });

  if (!funnel) throw new Error("Funnel does not exists.");

  await db.funnelPage.create({
    data: {
      ...values,
      funnelId,
    },
    include: { funnel: { include: { subAccount: true } } },
  });
};

export const updateFunnelPage = async (
  funnelPageId: string,
  values: TFunnelPageFormSchema
) => {
  await checkSession();
  const funnelPage = await db.funnelPage.findUnique({
    where: { id: funnelPageId },
  });

  if (!funnelPage) throw new Error("FunnelPage does not exist.");

  await db.funnelPage.update({
    where: { id: funnelPageId },
    data: values,
    include: { funnel: { include: { subAccount: true } } },
  });
};

export const updateFunnelPagesOrder = async (funnelPages: FunnelPage[]) => {
  try {
    const updateTransaction = funnelPages.map((page) =>
      db.funnelPage.update({
        where: { id: page.id },
        data: { order: page.order },
      })
    );

    await db.$transaction(updateTransaction);
  } catch (error) {
    console.log(error, "ERROR UPDATE FUNNEL PAGES ORDER");
  }
};

export const deleteFunnelPage = async (funnelPageId: string) => {
  await checkSession();
  await db.funnelPage.delete({
    where: { id: funnelPageId },
    include: { funnel: { include: { subAccount: true } } },
  });
};

export const clearFunnelPageElements = async (funnelPageId: string) => {
  await checkSession();
  await db.funnelPage.update({
    where : {id : funnelPageId},
    data : {elements : JSON.stringify(defaultPageElement)}
  })
}