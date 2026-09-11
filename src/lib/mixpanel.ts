import mixpanelBrowser from "mixpanel-browser";

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;
let initialized = false;

export function initMixpanel(): void {
  if (!TOKEN || initialized) return;
  // api_host: this Mixpanel project is on EU data residency (eu.mixpanel.com) —
  // the default US endpoint silently drops events sent with an EU project's token.
  mixpanelBrowser.init(TOKEN, { autocapture: false, track_pageview: false, api_host: "https://api-eu.mixpanel.com" });
  initialized = true;
}

export function track(eventName: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  mixpanelBrowser.track(eventName, properties);
}

// Links the anonymous pre-signup session to the real user id, so events before
// and after login/signup land in the same Mixpanel funnel.
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (!initialized) return;
  mixpanelBrowser.identify(userId);
  if (traits) mixpanelBrowser.people.set(traits);
}
