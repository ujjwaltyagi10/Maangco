import { Hexagon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PrepDocLogoProps {
  collapsed?: boolean;
}

export function PrepDocLogo({ collapsed = false }: PrepDocLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        collapsed ? "justify-center" : "gap-3",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-[1.1rem] bg-[#4d8c49] text-white shadow-[0_14px_28px_-18px_rgba(56,107,49,0.95)]">
        <Hexagon className="size-5 fill-current" />
      </span>
      {!collapsed ? (
        <span>
          <span className="block text-[1.08rem] font-semibold tracking-tight text-foreground">
            PrepDoc
          </span>
        </span>
      ) : null}
    </div>
  );
}
