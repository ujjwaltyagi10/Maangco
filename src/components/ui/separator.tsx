import * as React from "react";
import { Separator } from "radix-ui";

const SeparatorRoot = React.forwardRef<
  React.ComponentRef<typeof Separator.Root>,
  React.ComponentPropsWithoutRef<typeof Separator.Root>
>(({ decorative = true, ...props }, ref) => (
  <Separator.Root ref={ref} decorative={decorative} {...props} />
));
SeparatorRoot.displayName = "Separator";

export { SeparatorRoot as Separator };
