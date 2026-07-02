import * as React from "react";
import { DropdownMenu } from "radix-ui";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuGroup = DropdownMenu.Group;
const DropdownMenuLabel = DropdownMenu.Label;

// Override CSS position properties so the portal wrapper handles placement.
// The project's CSS classes add `position: absolute; top/right` which would
// double-offset inside the Radix popper wrapper — `position: static` cancels that.
const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(({ style, ...props }, ref) => (
  <DropdownMenu.Content
    ref={ref}
    style={{ position: "static", ...style }}
    {...props}
  />
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(({ ...props }, ref) => <DropdownMenu.Item ref={ref} {...props} />);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ ...props }, ref) => <DropdownMenu.Separator ref={ref} {...props} />);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
