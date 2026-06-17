export const AUTH_API_BASE_URL =
  (import.meta.env.VITE_AUTH_API_BASE_URL as string | undefined)?.trim() ||
  "https://backend-maangco.vercel.app";

export interface AuthSubscription {
  plan: string;
  billing: string;
  status: string;
  isActive: boolean;
  expiresAt: string | null;
}

export interface AuthUser {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  role?: string;
  provider?: string;
  is_email_verified?: boolean;
  has_password?: boolean;
  subscription?: AuthSubscription;
  [key: string]: unknown;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

interface AuthCredentials {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse {
  response: Response;
  data: unknown;
}

export interface RegistrationResult {
  user: AuthUser;
  message: string;
}

const loginPath = "/api/login";
const registerPath = "/api/signup";
const logoutPath = "/api/logout";
const mePath = "/api/me";
const changePasswordPath = "/api/change-password";
const forgotPasswordPath = "/api/forgot-password";
const resendVerificationEmailPath = "/api/resend-verification-email";
const verifyEmailPath = (token: string) =>
  `/api/verify-email/${encodeURIComponent(token)}`;
const resetPasswordPath = (token: string) =>
  `/api/reset-password/${encodeURIComponent(token)}`;
const refreshTokenPath = "/api/refresh-token";
const googlePath = "/api/google";
export const AUTH_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

function buildUrl(path: string) {
  return new URL(path, AUTH_API_BASE_URL).toString();
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function pickObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPasswordPolicyMessage() {
  return "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character";
}

export function isStrongPassword(password: string) {
  return AUTH_PASSWORD_REGEX.test(password);
}

function extractUser(data: unknown): AuthUser {
  const record = pickObject(data);
  if (!record) {
    return {};
  }

  const nested =
    pickObject(record.user) ??
    pickObject(record.data) ??
    pickObject(record.profile) ??
    pickObject(record.account) ??
    record;

  const user: AuthUser = {};
  const id = nested.id ?? nested._id ?? nested.userId;
  if (typeof id === "string" || typeof id === "number") {
    user.id = id;
  }

  const firstName = firstString(nested.first_name, nested.firstName);
  if (firstName) user.first_name = firstName;

  const lastName = firstString(nested.last_name, nested.lastName);
  if (lastName) user.last_name = lastName;

  const name = firstString(
    nested.name,
    nested.fullName,
    nested.displayName,
    firstName && lastName ? `${firstName} ${lastName}` : undefined,
  );
  if (name) user.name = name;

  const email = firstString(nested.email);
  if (email) user.email = email;

  const role = firstString(nested.role);
  if (role) user.role = role;

  const provider = firstString(nested.provider);
  if (provider) user.provider = provider;

  if (typeof nested.is_email_verified === "boolean") {
    user.is_email_verified = nested.is_email_verified;
  }

  if (typeof nested.has_password === "boolean") {
    user.has_password = nested.has_password;
  }

  return { ...nested, ...user };
}

function extractToken(data: unknown) {
  const record = pickObject(data);
  if (!record) {
    return undefined;
  }

  const nested = pickObject(record.data) ?? record;
  return firstString(
    nested.token,
    nested.accessToken,
    nested.jwt,
    nested.authToken,
    record.token,
    record.accessToken,
    record.jwt,
    record.authToken,
  );
}

function extractMessage(data: unknown) {
  const record = pickObject(data);
  if (!record) {
    return typeof data === "string" ? data : undefined;
  }

  return firstString(record.message, record.error, record.detail, record.title);
}

async function requestJson(
  path: string,
  init: RequestInit,
): Promise<ApiResponse> {
  const response = await fetch(buildUrl(path), init);
  const data = await readJsonResponse(response);
  return { response, data };
}

function withJson(init: RequestInit, body: unknown): RequestInit {
  return {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    body: JSON.stringify(body),
  };
}

function withAuth(init: RequestInit, token?: string): RequestInit {
  return {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  };
}

export class AuthExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "AuthExpiredError";
  }
}

function authErrorFromResponse(result: ApiResponse, fallbackMessage: string) {
  const message = extractMessage(result.data) || fallbackMessage;
  return new Error(message);
}

function normalizeSession(data: unknown, fallbackUser?: AuthUser): AuthSession {
  const token = extractToken(data);
  if (!token) {
    throw new Error("Auth response did not include a token.");
  }

  const user = extractUser(data);
  const mergedUser = {
    ...fallbackUser,
    ...user,
  };

  return { token, user: mergedUser };
}

export async function loginUser(credentials: AuthCredentials) {
  const payload = {
    email: credentials.email,
    password: credentials.password,
  };

  const result = await requestJson(loginPath, withJson({ method: "POST" }, payload));

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to sign in.");
  }

  return normalizeSession(result.data, {
    first_name: credentials.first_name,
    last_name: credentials.last_name,
    email: credentials.email,
  });
}

export async function registerUser(
  credentials: AuthCredentials,
): Promise<RegistrationResult> {
  const payload = {
    email: credentials.email,
    password: credentials.password,
    first_name: credentials.first_name,
    last_name: credentials.last_name,
  };

  const result = await requestJson(
    registerPath,
    withJson({ method: "POST" }, payload),
  );

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to create account.");
  }

  return {
    user: extractUser(result.data),
    message:
      extractMessage(result.data) ||
      "Account created successfully. Please verify your email.",
  };
}

export async function logoutUser(token: string) {
  const result = await requestJson(logoutPath, withAuth({ method: "POST" }, token));

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to log out.");
  }
}

export async function getCurrentUser(token: string) {
  const result = await requestJson(mePath, withAuth({ method: "GET" }, token));

  if (result.response.status === 401 || result.response.status === 403) {
    throw new AuthExpiredError();
  }

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to load your profile.");
  }

  const user = extractUser(result.data);

  // Attach subscription from top-level response field
  const record = pickObject(result.data);
  const sub = record ? pickObject(record.subscription) : null;
  if (sub && typeof sub.isActive === "boolean") {
    user.subscription = {
      plan: typeof sub.plan === "string" ? sub.plan : "",
      billing: typeof sub.billing === "string" ? sub.billing : "",
      status: typeof sub.status === "string" ? sub.status : "",
      isActive: sub.isActive,
      expiresAt: typeof sub.expiresAt === "string" ? sub.expiresAt : null,
    };
  }

  return { token, user };
}

export async function changePassword(
  token: string,
  input: ChangePasswordInput,
) {
  const result = await requestJson(
    changePasswordPath,
    withJson(
      withAuth({ method: "POST" }, token),
      {
        currentPassword: input.currentPassword,
        password: input.newPassword,
        newPassword: input.newPassword,
      },
    ),
  );

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to change password.");
  }

  return result.data;
}

export async function requestPasswordReset(email: string) {
  const result = await requestJson(
    forgotPasswordPath,
    withJson({ method: "POST" }, { email }),
  );

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to request password reset.");
  }

  return result.data;
}

export async function resendVerificationEmail(email: string) {
  const result = await requestJson(
    resendVerificationEmailPath,
    withJson({ method: "POST" }, { email }),
  );

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to resend verification email.");
  }

  return result.data;
}

export async function verifyEmail(token: string) {
  const result = await requestJson(verifyEmailPath(token), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to verify email.");
  }

  return result.data;
}

export async function resetPassword(token: string, password: string) {
  const result = await requestJson(
    resetPasswordPath(token),
    withJson({ method: "POST" }, { password, newPassword: password }),
  );

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to reset password.");
  }

  return result.data;
}

export async function refreshAccessToken() {
  const result = await requestJson(refreshTokenPath, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!result.response.ok) {
    throw authErrorFromResponse(result, "Unable to refresh your session.");
  }

  return normalizeSession(result.data);
}

export function getGoogleAuthUrl() {
  return buildUrl(googlePath);
}

export function parseAuthCallbackSearch(search: string) {
  const params = new URLSearchParams(search);
  const userValue = params.get("user");

  let user: AuthUser | undefined;
  if (userValue) {
    try {
      const parsed = JSON.parse(userValue) as unknown;
      user = extractUser(parsed);
    } catch {
      user = undefined;
    }
  }

  return {
    success: params.get("success"),
    message: params.get("message"),
    token:
      params.get("token") ??
      params.get("accessToken") ??
      params.get("authToken") ??
      undefined,
    email: params.get("email") ?? undefined,
    name: params.get("name") ?? undefined,
    username: params.get("username") ?? undefined,
    resetToken: params.get("resetToken") ?? params.get("passwordToken") ?? undefined,
    user,
  };
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
