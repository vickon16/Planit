"use client";

import { getCurrentUser } from "@/lib/auth-actions";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

interface CheckUserSessionProps {
  session: Session | null;
}

const CheckUserSession = ({ session }: CheckUserSessionProps) => {
  useQuery({
    enabled: !!session && !!session.user,
    queryKey: [queryKeys.session],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        return await signOut();
      }
    },
  });

  return <></>;
};

export default CheckUserSession;
