import akamaiLogo from "@/assets/svg/akamai.svg";
import bookingLogo from "@/assets/svg/bookingdotcom.svg";
import boxLogo from "@/assets/svg/boxy-svg.svg";
import capitalOneLogo from "@/assets/svg/capital-one.svg";
import ciscoLogo from "@/assets/svg/cisco-light.svg";
import cloudflareLogo from "@/assets/svg/cloudflare.svg";
import coinbaseLogo from "@/assets/svg/coinbase.svg";
import datadogLogo from "@/assets/svg/datadog.svg";
import dropboxLogo from "@/assets/svg/dropbox.svg";
import ebayLogo from "@/assets/svg/ebay.svg";
import figmaLogo from "@/assets/svg/figma.svg";
import ibmLogo from "@/assets/svg/ibm.svg";
import notionLogo from "@/assets/svg/notion.svg";
import paypalLogo from "@/assets/svg/paypal.svg";
import snapLogo from "@/assets/svg/snap.svg";
import spotifyLogo from "@/assets/svg/spotify.svg";
import stripeLogo from "@/assets/svg/stripe.svg";
import twilioLogo from "@/assets/svg/twilio.svg";
import vmwareLogo from "@/assets/svg/vmware.svg";
import waymoLogo from "@/assets/svg/waymo.svg";
import youtubeLogo from "@/assets/svg/youtube.svg";
import zoomLogo from "@/assets/svg/zoom.svg";

import adobeLogo from "@/assets/adobe.png";
import airbnbLogo from "@/assets/airbnb.png";
import amazonLogo from "@/assets/Amazon.png";
import appleLogo from "@/assets/apple.png";
import atlassianLogo from "@/assets/atlassian.png";
import bloombergLogo from "@/assets/bloomberg.png";
import citadelLogo from "@/assets/Citadel.png";
import flipkartLogo from "@/assets/flipkart.png";
import goldmanLogo from "@/assets/goldman.png";
import googleLogo from "@/assets/google.png";
import linkedinLogo from "@/assets/svg/linkedin-tile.svg";
import metaLogo from "@/assets/meta.png";
import microsoftLogo from "@/assets/microsoft.png";
import netflixLogo from "@/assets/netflix.png";
import nvidiaLogo from "@/assets/nvidia.png";
import oracleLogo from "@/assets/Oracle.png";
import pinterestLogo from "@/assets/pinterest.png";
import salesforceLogo from "@/assets/Salesforce.png";
import snowflakeLogo from "@/assets/Snowflake.png";
import tcsLogo from "@/assets/TCS.png";
import tiktokLogo from "@/assets/tiktok.png";
import uberLogo from "@/assets/uber.png";
import visaLogo from "@/assets/visa.png";
import walmartLogo from "@/assets/Walmart.png";

import appleLightSvg from "@/assets/svg/apple-light.svg";
import appleDarkSvg from "@/assets/svg/apple-dark.svg";
import amazonLightSvg from "@/assets/svg/amazon.svg";
import amazonDarkSvg from "@/assets/svg/amazon-dark.svg";
import visaLightSvg from "@/assets/svg/visa.svg";
import visaDarkSvg from "@/assets/svg/visa-dark.svg";
import tcsDarkSvg from "@/assets/svg/tcs-dark.svg";
import tiktokLightSvg from "@/assets/svg/tiktok-light.svg";
import tiktokDarkSvg from "@/assets/svg/tiktok-dark.svg";
import bloombergDarkSvg from "@/assets/svg/bloomberg-dark.svg";
import citadelDarkSvg from "@/assets/svg/citadel-dark.svg";

// Companies whose default logo (a dark/black mark) disappears against dark-mode
// surfaces. Each entry swaps in a light-on-dark variant for [data-theme="dark"].
export const COMPANY_LOGO_VARIANTS: Record<string, { light: string; dark: string }> = {
  Apple: { light: appleLightSvg, dark: appleDarkSvg },
  Amazon: { light: amazonLightSvg, dark: amazonDarkSvg },
  Visa: { light: visaLightSvg, dark: visaDarkSvg },
  TCS: { light: tcsLogo, dark: tcsDarkSvg },
  TikTok: { light: tiktokLightSvg, dark: tiktokDarkSvg },
  Bloomberg: { light: bloombergLogo, dark: bloombergDarkSvg },
  Citadel: { light: citadelLogo, dark: citadelDarkSvg },
};

export const COMPANY_LOGOS: Record<string, string> = {
  Google: googleLogo,
  Meta: metaLogo,
  Amazon: amazonLogo,
  Apple: appleLogo,
  Netflix: netflixLogo,
  Microsoft: microsoftLogo,
  Adobe: adobeLogo,
  Uber: uberLogo,
  Flipkart: flipkartLogo,
  Walmart: walmartLogo,
  Atlassian: atlassianLogo,
  Bloomberg: bloombergLogo,
  TikTok: tiktokLogo,
  Nvidia: nvidiaLogo,
  Salesforce: salesforceLogo,
  "Goldman Sachs": goldmanLogo,
  Citadel: citadelLogo,
  Snowflake: snowflakeLogo,
  TCS: tcsLogo,
  Airbnb: airbnbLogo,
  Pinterest: pinterestLogo,
  Oracle: oracleLogo,
  Visa: visaLogo,
  LinkedIn: linkedinLogo,
  Akamai: akamaiLogo,
  "Booking.com": bookingLogo,
  Box: boxLogo,
  "Capital One": capitalOneLogo,
  Cisco: ciscoLogo,
  Cloudflare: cloudflareLogo,
  Coinbase: coinbaseLogo,
  Datadog: datadogLogo,
  Dropbox: dropboxLogo,
  eBay: ebayLogo,
  Figma: figmaLogo,
  IBM: ibmLogo,
  Notion: notionLogo,
  PayPal: paypalLogo,
  Snap: snapLogo,
  Spotify: spotifyLogo,
  Stripe: stripeLogo,
  Twilio: twilioLogo,
  VMware: vmwareLogo,
  Waymo: waymoLogo,
  YouTube: youtubeLogo,
  Zoom: zoomLogo,
};
