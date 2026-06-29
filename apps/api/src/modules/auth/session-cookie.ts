import { createHash, randomBytes } from "node:crypto";
import type { CookieOptions, Response } from "express";
import type { ApiEnvironment } from "../../config/env";

const DEVELOPMENT_COOKIE_NAME = "agentos_session";
const PRODUCTION_COOKIE_NAME = "__Host-agentos_session";

export const createSessionToken = (): string => randomBytes(32).toString("base64url");

export const hashSessionToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const sessionExpiry = (environment: ApiEnvironment): Date =>
  new Date(Date.now() + environment.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

export const setSessionCookie = (
  response: Response,
  token: string,
  environment: ApiEnvironment,
): void => {
  response.cookie(sessionCookieName(environment), token, cookieOptions(environment));
};

export const clearSessionCookie = (response: Response, environment: ApiEnvironment): void => {
  response.clearCookie(sessionCookieName(environment), {
    ...cookieOptions(environment),
    maxAge: undefined,
  });
};

export const readSessionToken = (
  cookieHeader: string | undefined,
  environment: ApiEnvironment,
): string | undefined => {
  if (!cookieHeader) {
    return undefined;
  }

  const targetName = sessionCookieName(environment);
  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const name = cookie.slice(0, separator).trim();
    if (name === targetName) {
      return decodeURIComponent(cookie.slice(separator + 1).trim());
    }
  }

  return undefined;
};

export const parseSessionToken = (
  cookieHeader: string | undefined,
  environment: ApiEnvironment,
): string | undefined => {
  const token = readSessionToken(cookieHeader, environment);
  return token ? hashSessionToken(token) : undefined;
};

const sessionCookieName = (environment: ApiEnvironment): string =>
  environment.NODE_ENV === "production" ? PRODUCTION_COOKIE_NAME : DEVELOPMENT_COOKIE_NAME;

const cookieOptions = (environment: ApiEnvironment): CookieOptions => ({
  httpOnly: true,
  secure: environment.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: environment.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
});
