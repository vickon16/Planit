"use client";

import Image from "next/image";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { appLinks } from "@/lib/appLinks";

interface LogoProps extends HTMLAttributes<HTMLAnchorElement> {}

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(({ className }, ref) => {
  return (
    <Link
      href={appLinks.site}
      className={cn(
        "",
        className
      )}
      ref={ref}
      aria-label="logo"
    >
      <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] relative">
        <Image
          src="/assets/logo.svg"
          alt="Logo"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="w-full h-full object-contain"
        />
      </div>
    </Link>
  );
});

Logo.displayName = "Logo";

export default Logo;
