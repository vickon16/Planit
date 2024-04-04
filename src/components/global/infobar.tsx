"use client";

import { cn, zPriority } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import Logo from "../planit-logo";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";

type AgencyProps = {
  type: "agency";
  data: Prisma.AgencyGetPayload<{
    include: {
      user: true;
      subAccounts: {
        include: { notifications: true };
      };
      notifications: true;
    };
  }>;
};

type SubAccountProps = {
  type: "subAccount";
  data: Prisma.SubAccountGetPayload<{
    include: {
      user: true;
      agency: true;
      notifications: true;
    };
  }>;
};

type Props = AgencyProps | SubAccountProps;

const InfoBar = ({ type, data }: Props) => {
  const [subAccountNotification, setSubAccountNotification] = useState(false);

  const newNotifications = useMemo(() => {
    if (!Array.isArray(data.notifications)) return;

    let notification;

    if (type === "agency" && !!subAccountNotification) {
      const subAccountNotification = data.subAccounts
        .map((account) => account.notifications)
        .filter(Boolean);
      notification = subAccountNotification.flat();
    } else if (type === "agency" && !subAccountNotification) {
      notification = data.notifications || [];
    } else if (type === "subAccount") {
      notification = data.notifications || [];
    }

    return (
      notification?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || []
    );
  }, [data, type, subAccountNotification]);

  return (
    <div className={cn("py-4 px-2 border-b border-t w-full")}>
      <Sheet>
        <SheetTrigger className="w-full">
          <div className="px-2 py-3 rounded-md border w-full flex gap-x-2 items-center hover:bg-muted/30 transition-opacity">
            <div className="rounded-full size-7 bg-primary flex items-center justify-center text-white relative">
              {Array.isArray(newNotifications) &&
                newNotifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full flex items-center justify-center p-1 text-foreground text-xs font-bold bg-emerald-700 shrink-0">
                    {newNotifications.length}
                  </span>
                )}
              <Bell size={14} />
            </div>
            <p className="font-semibold">Notifications</p>
          </div>
        </SheetTrigger>

        <SheetContent className={cn("mt-4 mr-4 pr-4", zPriority.pr4)}>
          <SheetHeader className="text-left space-y-2">
            <div className="flex items-center gap-x-1">
              <Logo />
              <SheetTitle>
                {type === "agency" ? "Agency" : "Sub Account"} Notifications
              </SheetTitle>
            </div>

            <SheetDescription>
              All your {type === "agency" ? "agency" : "sub account"}{" "}
              notifications will appear here.
            </SheetDescription>

            {type === "agency" && (
              <SheetDescription className="!mt-6 !space-y-1">
                <Card className="flex items-center justify-between p-4">
                  Sub Account Notifications
                  <Switch onCheckedChange={setSubAccountNotification} />
                </Card>
                <div>Switch to view all your sub account notifications</div>
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="my-8 overflow-y-auto h-[calc(100svh_-_300px)] pb-10 w-full">
            {Array.isArray(newNotifications) &&
              newNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-y-2 w-full text-ellipsis p-2"
                >
                  <div className="flex gap-2">
                    <Avatar className="size-8 text-sm">
                      <AvatarFallback className="bg-primary">
                        {notification.notification
                          .split("|")[0]
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-y-1">
                      <p className="line-clamp-3">
                        <span className="font-bold text-sm">
                          {notification.notification.split("|")[0]} -
                        </span>
                        <span className="text-white/70 text-sm">
                          {notification.notification.split("|")[1]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}

            {newNotifications?.length === 0 && (
              <div
                className="flex items-center justify-center text-muted-foreground mt-6"
                mb-4
              >
                You have no notifications
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InfoBar;
