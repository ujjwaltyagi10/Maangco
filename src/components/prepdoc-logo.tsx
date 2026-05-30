import { FileStack } from "lucide-react";

import { cn } from "@/lib/utils";

interface PrepDocLogoProps {
  collapsed?: boolean;
}

export function PrepDocLogo({ collapsed = false }: PrepDocLogoProps) {
  return (
    <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#166534,#4ade80)] text-white shadow-[0_16px_40px_-24px_rgba(22,101,52,0.85)]">
        <FileStack className="size-5" />
      </span>
      {!collapsed ? (
        <span>
          <span className="block text-base font-semibold tracking-tight text-foreground">PrepDoc</span>
          <span className="block text-xs text-muted-foreground">Interview system</span>
        </span>
      ) : null}
    </div>
  );
}
