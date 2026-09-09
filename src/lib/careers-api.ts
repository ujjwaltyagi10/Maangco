import { AUTH_API_BASE_URL } from "./auth-api";

export interface CareerRole {
  id: string;
  title: string;
  type: string;
  experience: string | null;
  location: string;
  description: string;
}

export async function fetchCareerRoles(): Promise<CareerRole[]> {
  const res = await fetch(`${AUTH_API_BASE_URL}/api/careers`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load open roles");
  const data = (await res.json()) as { success: boolean; data: CareerRole[] };
  return data.data;
}
