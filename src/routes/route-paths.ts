import type { AppPanel } from "@/types/maangco";

export type AuthMode = "login" | "register" | "forgot" | "reset" | "verify";

export interface AuthSubmitResult {
  nextRoute: string;
  message?: string;
}

export const ROUTES = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  googleCallback: "/auth/google/callback",
  termsConditions: "/terms-and-conditions",
  privacyPolicy: "/privacy-policy",
  cancellationPolicy: "/cancellation-policy",
  financialAid: "/financial-aid",
  contact: "/contact",
  dashboard: "/dashboard",
  dsa: "/dsa",
  systemDesign: "/system-design",
  frontend: "/frontend",
} as const;

export function authPathForMode(mode: AuthMode, token?: string) {
  switch (mode) {
    case "login":
      return ROUTES.login;
    case "register":
      return ROUTES.signup;
    case "forgot":
      return ROUTES.forgotPassword;
    case "reset":
      return token ? `${ROUTES.resetPassword}/${token}` : ROUTES.resetPassword;
    case "verify":
      return token ? `${ROUTES.verifyEmail}/${token}` : ROUTES.verifyEmail;
    default:
      return ROUTES.login;
  }
}

export function panelPath(panel: AppPanel) {
  switch (panel) {
    case "dashboard":
      return ROUTES.dashboard;
    case "dsa":
      return ROUTES.dsa;
    case "system-design":
      return ROUTES.systemDesign;
    case "frontend":
      return ROUTES.frontend;
    default:
      return ROUTES.dashboard;
  }
}

export function panelFromPath(pathname: string): AppPanel {
  const path = pathname.toLowerCase();
  if (path === ROUTES.dsa) return "dsa";
  if (path === ROUTES.systemDesign) return "system-design";
  if (path === ROUTES.frontend) return "frontend";
  return "dashboard";
}

export function authModeFromPath(pathname: string): AuthMode {
  const path = pathname.toLowerCase();
  if (path === ROUTES.signup) return "register";
  if (path === ROUTES.forgotPassword) return "forgot";
  if (path.startsWith(`${ROUTES.resetPassword}/`)) return "reset";
  if (path.startsWith(`${ROUTES.verifyEmail}/`)) return "verify";
  return "login";
}
