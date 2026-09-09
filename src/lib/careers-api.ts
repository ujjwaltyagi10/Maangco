import { AUTH_API_BASE_URL } from "./auth-api";

export interface CareerRole {
  id: string;
  title: string;
  type: string;
  experience: string | null;
  location: string;
  description: string;
}

const CACHE_KEY = "careerRolesCache";
let memoryCache: CareerRole[] | null = null;

export function getCachedCareerRoles(): CareerRole[] | null {
  if (memoryCache) return memoryCache;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      memoryCache = JSON.parse(raw) as CareerRole[];
      return memoryCache;
    }
  } catch {
    // sessionStorage unavailable — fall through to a normal fetch
  }
  return null;
}

export async function fetchCareerRoles(): Promise<CareerRole[]> {
  const res = await fetch(`${AUTH_API_BASE_URL}/api/careers`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load open roles");
  const data = (await res.json()) as { success: boolean; data: CareerRole[] };
  memoryCache = data.data;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
  } catch {
    // sessionStorage unavailable — cached in memory only, still fine for this tab
  }
  return data.data;
}

export interface CareerApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  resume: File;
}

export async function submitCareerApplication(roleId: string, input: CareerApplicationInput): Promise<void> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  if (input.linkedinUrl) formData.append("linkedinUrl", input.linkedinUrl);
  formData.append("resume", input.resume);

  const res = await fetch(`${AUTH_API_BASE_URL}/api/careers/${roleId}/apply`, {
    method: "POST",
    body: formData,
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok) {
    throw new Error(data.message || "Failed to submit application");
  }
}
