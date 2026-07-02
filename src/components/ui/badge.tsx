import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Maps to the project's .diff-badge CSS class and difficulty variants.
const badgeVariants = cva("diff-badge", {
  variants: {
    variant: {
      Easy: "Easy",
      Medium: "Medium",
      Hard: "Hard",
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
