import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const userSettings = createCookie("user-settings", {
  maxAge: 365 * 24 * 60 * 60, // One year
});
