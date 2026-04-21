export const SESSION_COOKIE_NAME = "ablate_session";

export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"] as const;

export const PROTECTED_ROUTE_PREFIXES = ["/dashboard"] as const;

export const DEFAULT_POST_LOGIN_REDIRECT = "/dashboard";
