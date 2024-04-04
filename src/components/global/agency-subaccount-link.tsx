import { TPlanitAccounts } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  type : TPlanitAccounts;
  href : string;
  src : string;
  name : string;
  address : string;
  smallTexts? : boolean
};

const AgencySubAccountLink = ({type, src, name, address, href, smallTexts}: Props) => {
  return (
    <Link
      href={href}
      className="flex gap-x-2 w-full h-full px-2 py-3"
    >
      <div className={cn("relative w-14", {
        "w-8" : type === "subAccount"
      })}>
        <Image
          src={src}
          alt={type === "agency" ? "Agency Logo" : "Sub Account Logo"}
          fill
          className="rounded-md object-contain"
        />
      </div>

      <div className="flex flex-col flex-1 gap-y-1">
        <p className={cn("text-base", {
          "text-sm" : smallTexts
        })}>{name}</p>
        <span className={cn("text-muted-foreground text-sm", {
          "text-xs" : smallTexts
        })}>{address}</span>
      </div>
    </Link>
  );
};

export default AgencySubAccountLink;
