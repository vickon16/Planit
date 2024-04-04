"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { db } from "./db";

export async function getCustomSession() {
  return await getServerSession(authOptions);
}

export const getCurrentUser = async (id?: string) => {
  const session = await getCustomSession();
  if (!session || !session.user.id) return null;

  let userData;

  if (id) {
    userData = await db.user.findUnique({
      where: { id },
      include: {
        agency: {
          include: { planitAccount: { include: { planitSubscription: true } } },
        },
        agencyTeam: true,
        subAccount: true,
        subAccountTeam : true,
      },
    });
  } else {
    userData = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        agency: {
          include: { planitAccount: { include: { planitSubscription: true } } },
        },
        agencyTeam: true,
        subAccount: true,
        subAccountTeam : true,
      },
    });
  }
  return userData;
};
