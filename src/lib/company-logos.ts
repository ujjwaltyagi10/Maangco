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
};
