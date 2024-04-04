"use client";

import InfoBar from "@/components/global/infobar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { appLinks } from "@/lib/appLinks";
import {
  agencyIdSideBarOptions,
  appIcons,
  subAccountIdSideBarOptions,
} from "@/lib/constants";
import { cn, zPriority } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ChevronsUpDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import AgencySubAccountLink from "./global/agency-subaccount-link";
import CreateSubAccountButton from "./global/create-subaccount-button";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";

type AgencyProps = {
  type: "agency";
  defaultOpen?: boolean;
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
  defaultOpen?: boolean;
  data: Prisma.SubAccountGetPayload<{
    include: {
      user: true;
      agency: true;
      notifications: true;
    };
  }>;
};

type Props = AgencyProps | SubAccountProps;


const Sidebar = ({ type, defaultOpen, data }: Props) => {
  const { data: session } = useSession();

  const sideBarLogo =
    (type === "agency"
      ? data.agencyLogo
      : data.agency.whiteLabel
      ? data.agency.agencyLogo
      : data.subAccountLogo) || "/assets/logo.svg";

  const openState = useMemo(() => defaultOpen, [defaultOpen]);

  return (
    <Sheet open={openState} modal={!defaultOpen}>
      <SheetTrigger
        asChild
        className={cn(
          "flex md:hidden fixed left-0 top-3 right-0 mx-auto items-center justify-center",
          zPriority.pr4
        )}
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={cn(
          `bg-background/80 backdrop-blur-xl flex-col gap-y-2 fixed top-0 border-r-[1px] p-4 ${
            defaultOpen
              ? `hidden md:flex w-[300px] ${zPriority.pr0}`
              : `flex md:hidden w-full ${zPriority.pr4}`
          }`
        )}
      >
        <div className="mt-[70px] w-full">
          <div className="w-full h-[80px] relative">
            <Image
              src={sideBarLogo}
              alt={type === "agency" ? "Agency Logo" : "Sub Account Logo"}
              fill
              className="rounded-sm object-contain h-full w-full"
            />
          </div>

          <SheetClose asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="w-full my-4 flex items-center justify-between py-10"
                  variant="ghost"
                >
                  <div className="flex items-center justify-between w-full text-left gap-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm ">{data.name}</p>
                      <span className="text-muted-foreground text-xs">
                        {data.address}
                      </span>
                    </div>
                    <ChevronsUpDown className="text-muted-foreground size-5 shrink-0" />
                  </div>
                </Button>
              </PopoverTrigger>

              {type === "agency" && (
                <PopoverContent
                  className={`mt-2 ${zPriority.pr4} max-md:w-full p-2 w-80`}
                >
                  <Command className="rounded-lg">
                    <CommandInput placeholder="Search Accounts..." />
                    <CommandList className="py-4">
                      <CommandEmpty className="text-muted-foreground text-sm text-center">
                        No results found
                      </CommandEmpty>

                      <CommandGroup heading="Agency">
                        <CommandItem className="!bg-transparent my-2 text-primary border border-border/80 rounded-md hover:!bg-muted/50 cursor-pointer transition-all">
                          <AgencySubAccountLink
                            smallTexts
                            type={"agency"}
                            href={`${appLinks.agency}/${data.id}`}
                            src={sideBarLogo}
                            name={data.name}
                            address={data.address}
                          />
                        </CommandItem>
                      </CommandGroup>

                      <CommandGroup heading="Sub Accounts">
                        {type === "agency" &&
                        Array.isArray(data.subAccounts) &&
                        data.subAccounts.length > 0 ? (
                          data.subAccounts.map((subAccount) => (
                            <CommandItem key={subAccount.id}>
                              <AgencySubAccountLink
                                smallTexts
                                type={"subAccount"}
                                href={`${appLinks.subAccount}/${subAccount.id}`}
                                src={
                                  data.whiteLabel
                                    ? data.agencyLogo
                                    : subAccount.subAccountLogo
                                }
                                name={subAccount.name}
                                address={subAccount.address}
                              />
                            </CommandItem>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-xs w-full text-center py-4">
                            No Sub Account
                          </p>
                        )}
                      </CommandGroup>
                    </CommandList>

                    <CreateSubAccountButton
                      agencyId={data.id}
                      subAccountData={{ agencyId: data.id }}
                      className="w-full"
                    />
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          </SheetClose>

          <p className="text-muted-foreground text-xs mt-6 mb-2">MENU LINKS</p>

          <Separator className="mb-4" />
        </div>

        <div className="overflow-auto md:overflow-visible">
          <Command className="rounded-md overflow-visible bg-transparent w-full h-fit">
            <CommandInput placeholder="Search..." />
            <CommandList className="py-4 overflow-visible max-h-full h-full">
              <CommandEmpty className="!text-muted-foreground text-xs text-center mt-2">
                No Results Found
              </CommandEmpty>

              <CommandGroup className="overflow-visible w-full [&_[cmdk-group-items]]:overflow-visible [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-y-3">
                {type === "agency" &&
                  agencyIdSideBarOptions.map((option) => {
                    const result = appIcons.find(
                      (icon) => icon.value === option.icon
                    );

                    return (
                      <CommandItem
                        key={option.link + option.name}
                        className="w-full md:w-[320px] aria-selected:text-primary"
                      >
                        <Link
                          href={`${appLinks.agency}/${data.id}/${option.link}`}
                          className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                        >
                          {!!result && <result.path />}
                          <span className="w-full">{option.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}

                {type === "subAccount" &&
                  subAccountIdSideBarOptions.map((option) => {
                    const result = appIcons.find(
                      (icon) => icon.value === option.icon
                    );

                    return (
                      <CommandItem
                        key={option.link + option.name}
                        className="w-full md:w-[320px] aria-selected:text-primary"
                      >
                        <Link
                          href={`${appLinks.subAccount}/${data.id}/${option.link}`}
                          className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                        >
                          {!!result && <result.path />}
                          <span className="w-full">{option.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>

          {/* @ts-ignore */}
          <InfoBar type={type} data={data} />
        </div>
        {type === "subAccount" && data.agency.userId === session?.user.id && (
          <Link
            href={`${appLinks.agency}/${data.agencyId}`}
            className="text-sm ml-4 my-2 hover:underline hover:underline-offset-2"
          >
            &larr; Back to Agency
          </Link>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
