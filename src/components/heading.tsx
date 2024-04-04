import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface HeadingProps extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  description?: string;
  center?: boolean;
  headingSize?: "default" | "base" | "md" | "sm";
  headingColor?: "default" | "primary" | "destructive";
  descriptionSize?: "base" | "sm";
  descriptionWidth? : "truncated" | "full";
}

const Heading = forwardRef<HTMLDivElement, HeadingProps>(
  (
    {
      heading,
      description,
      className,
      headingSize = "default",
      headingColor = "default",
      descriptionSize = "sm",
      descriptionWidth = "truncated",
      center,
    },
    ref
  ) => {
    return (
      <div
        className={cn(`flex flex-col gap-y-1.5`, className, {
          "text-center": center,
        })}
        ref={ref}
      >
        <h2
          className={cn("font-bold", {
            "!text-foreground" : headingColor === "default",
            "!text-primary" : headingColor === "primary",
            "!text-destructive" : headingColor === "destructive",
            "text-clampLg": headingSize === "default",
            "text-clampBase": headingSize === "base",
            "text-clampMd": headingSize === "md",
            "text-clampSm": headingSize === "sm",
          })}
        >
          {heading}
        </h2>
        {!!description && (
          <p
            className={cn(
              "text-muted-foreground w-full ",
              {
                "mx-auto": center,
                "text-sm" : descriptionSize === "sm",
                "text-base" : descriptionSize === "base",
                "max-w-[700px] " : descriptionWidth === "truncated",
                "" : descriptionWidth === "full",
              }
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
