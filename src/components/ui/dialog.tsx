import * as React from "react";
import { Dialog } from "radix-ui";

const DialogRoot = Dialog.Root;
const DialogPortal = Dialog.Portal;
const DialogClose = Dialog.Close;

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ ...props }, ref) => <Dialog.Title ref={ref} {...props} />);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ ...props }, ref) => <Dialog.Description ref={ref} {...props} />);
DialogDescription.displayName = "DialogDescription";

// Dialog.Content IS the full-screen overlay container — inner card div is a plain child.
// This matches the project's existing pattern where the overlay div flex-centers the card.
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ children, ...props }, ref) => (
  <Dialog.Content ref={ref} {...props}>
    {children}
  </Dialog.Content>
));
DialogContent.displayName = "DialogContent";

export {
  DialogRoot,
  DialogPortal,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogContent,
};
