import { cn } from "@/lib/utils";
import { Ban } from "lucide-react";
import React, { HTMLAttributes, forwardRef } from "react";

interface EmptyComponentProps extends HTMLAttributes<HTMLDivElement> {
  icon?: boolean;
  heading: string;
  description?: string;
  headingSize?: "default" | "sm";
  children?: React.ReactNode;
  center?: boolean;
}

const EmptyComponent = forwardRef<HTMLDivElement, EmptyComponentProps>(
  (
    {
      className,
      icon,
      heading,
      description = "An Error has occurred on your request. Please, make sure you are properly making this request.",
      center = false,
      children,
      headingSize = "default",
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col justify-center space-y-6 !my-14",
          className,
          {
            "items-center text-center": center,
          }
        )}
        ref={ref}
      >
        {!!icon && (
          <Ban className="w-5 sm:w-7 h-5 sm:h-7 shrink-0 text-destructive" />
        )}
        <div className={cn("space-y-1")}>
          <p
            className={cn("font-bold", {
              "text-clampMd": headingSize === "default",
              "text-clampSm": headingSize === "sm",
            })}
          >
            {heading}
          </p>
          {!!description && (
            <div className="text-clampXs text-muted-foreground max-w-prose">
              {description}
            </div>
          )}
        </div>

        {children}
      </div>
    );
  }
);

EmptyComponent.displayName = "EmptyComponent";

export default EmptyComponent;
