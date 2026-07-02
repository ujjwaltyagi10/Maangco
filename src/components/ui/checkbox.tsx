import * as React from "react";
import { Checkbox } from "radix-ui";

// Radix Checkbox.Root renders as a <button> with role="checkbox" and ARIA attributes.
// The project CSS (.q-cb, .q-cb.checked, .q-cb.checked::after) handles all visuals.
// Pass the checked class manually so the existing CSS works unchanged.
const CheckboxRoot = React.forwardRef<
  React.ComponentRef<typeof Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof Checkbox.Root>
>(({ ...props }, ref) => <Checkbox.Root ref={ref} {...props} />);
CheckboxRoot.displayName = "CheckboxRoot";

const CheckboxIndicator = Checkbox.Indicator;

export { CheckboxRoot, CheckboxIndicator };
