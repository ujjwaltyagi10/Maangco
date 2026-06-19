import { useEffect, useRef } from "react";
import { googleOneTapLogin } from "@/lib/auth-api";
import type { AuthSession } from "@/lib/auth-api";

interface UseGoogleOneTapOptions {
  isAuthenticated: boolean;
  onSuccess: (session: AuthSession) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export function useGoogleOneTap({ isAuthenticated, onSuccess }: UseGoogleOneTapOptions) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const initialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated || !clientId || initialized.current) return;

    const init = () => {
      if (!window.google?.accounts?.id) return;
      initialized.current = true;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const { token, user } = await googleOneTapLogin(response.credential);
            onSuccess({ token, user });
          } catch {
            // silently ignore — user can still use regular login
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    // Script may already be loaded or still loading
    if (window.google?.accounts?.id) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          init();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      window.google?.accounts?.id?.cancel();
    };
  }, [isAuthenticated, clientId, onSuccess]);
}
