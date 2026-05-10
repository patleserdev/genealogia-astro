import { defineMiddleware } from "astro:middleware";
import { verifyToken } from "./lib/auth";
import { db } from "./lib/mongo";
import { ObjectId } from "mongodb";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/invite",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/debug",
  "/api/invitations/validate",
];

const PUBLIC_API_ROUTES = [
  "/api/persons/search",
  "/api/invitations/validate",
  "/api/invitations/accept",
];

const OWNER_ROUTES = [
  "/invitations",
  "/persons/add-with-relations",
  "/relations/add-quick",
  "/api/invitations/create",
  "/api/invitations/list",
  "/api/change-requests/review",
  "/api/users",
  "/users",
];

const GUEST_ROUTES = [
  "/change-requests/new",
];

export const onRequest = defineMiddleware(async ({ request, cookies, redirect }, next) => {
  const url = new URL(request.url);
  const path = url.pathname;

  const isPublic =
    PUBLIC_ROUTES.some(r => path.startsWith(r)) ||
    PUBLIC_API_ROUTES.some(r => path.startsWith(r)) ||
    path.startsWith("/invite");

  if (isPublic) return next();

  const token = cookies.get("token")?.value;
  if (!token) return redirect("/login");

  let payload;

  try {
    payload = verifyToken(token);

    // 🔥 FIX CRITIQUE : check user exists en DB
    const user = await db.collection("users").findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user) {
      cookies.delete("token", { path: "/" });
      return redirect("/login");
    }

    // optionnel : inject user
    (request as any).user = user;
  } catch {
    cookies.delete("token", { path: "/" });
    return redirect("/login");
  }

  // OWNER GUARD
  if (
    OWNER_ROUTES.some(r => path.startsWith(r)) &&
    payload.role !== "OWNER"
  ) {
    if (path.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    return redirect("/persons");
  }

  // GUEST GUARD
  if (
    GUEST_ROUTES.some(r => path.startsWith(r)) &&
    payload.role === "OWNER"
  ) {
    return redirect("/persons");
  }

  return next();
});