import type { APIRoute } from "astro";
import { db } from "../../../lib/mongo";

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Token manquant" }), { status: 400 });
  }

  const inv = await db.collection("invitations").findOne({
    token,
    status: "PENDING",
  });

  if (!inv) {
    return new Response(JSON.stringify({ valid: false }), { status: 404 });
  }

  return new Response(JSON.stringify({
    valid: true,
    toEmail: inv.toEmail,
    sharedPersonIds: inv.sharedPersonIds ?? [],
    expiresAt: inv.expiresAt,
  }));
};