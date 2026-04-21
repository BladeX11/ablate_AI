import type { AuthUser } from "./types";

type JsonBody = Record<string, unknown>;

type ApiError = {
  error?: string;
};

async function requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorJson = (await response.json()) as ApiError;
      if (errorJson.error) {
        message = errorJson.error;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

function post<T>(url: string, body: JsonBody): Promise<T> {
  return requestJson<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function login(input: { email: string; password: string }): Promise<{ user: AuthUser }> {
  return post<{ user: AuthUser }>("/api/auth/login", input);
}

export function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return post<{ user: AuthUser }>("/api/auth/signup", input);
}

export function forgotPassword(input: { email: string }): Promise<{ message: string; resetToken?: string }> {
  return post<{ message: string; resetToken?: string }>("/api/auth/forgot-password", input);
}

export function resetPassword(input: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return post<{ message: string }>("/api/auth/reset-password", input);
}

export function logout(): Promise<{ success: boolean }> {
  return post<{ success: boolean }>("/api/auth/logout", {});
}

export function me(): Promise<{ user: AuthUser }> {
  return requestJson<{ user: AuthUser }>("/api/auth/me", {
    method: "GET",
  });
}
