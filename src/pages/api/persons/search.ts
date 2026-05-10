import type { APIRoute } from "astro";
import { db } from "../../../lib/mongo.ts";
import { verifyToken } from "../../../lib/auth";
import { ObjectId } from "mongodb";

export const GET: APIRoute = async ({ url, cookies }) => {
  const q = url.searchParams.get("q") ?? "";
  const inviteToken = url.searchParams.get("inviteToken");

  console.log("searching",q)
  const token = cookies.get("token")?.value;

  let role: "OWNER" | "GUEST" | null = null;
  let userId: ObjectId | null = null;
  let sharedPersonIds: ObjectId[] | null = null;

  // ─────────────────────────────
  // AUTH USER
  // ─────────────────────────────
  if (token) {
    try {
      const payload = verifyToken(token);
      role = payload.role;
      userId = new ObjectId(payload.userId);
    } catch {
      role = null;
    }
  }

  // ─────────────────────────────
  // INVITE MODE (IMPORTANT FIX)
  // ─────────────────────────────
  if (!role && inviteToken) {
    const inv = await db.collection("invitations").findOne({
      token: inviteToken,
      status: "PENDING",
    });

    if (inv) {
      sharedPersonIds = (inv.sharedPersonIds ?? []).map(
        (id: any) => new ObjectId(id)
      );
      role = "GUEST";
    }
  }

  const safeQ = q.trim();

  const baseFilter: any = {
    active: true,
  };

  // recherche seulement si texte
  if (safeQ.length > 0) {
    baseFilter.$or = [
      { prenom: { $regex: safeQ, $options: "i" } },
      { nom: { $regex: safeQ, $options: "i" } },
    ];
  }

  // ─────────────────────────────
  // OWNER
  // ─────────────────────────────
  if (role === "OWNER") {
    // rien → accès total
  }

  // ─────────────────────────────
  // USER LOGGED
  // ─────────────────────────────
  else if (role && userId) {
    console.log('mode user logged')
    const links = await db
      .collection("user_persons")
      .find({ userId })
      .project({ personId: 1 })
      .toArray();

    baseFilter._id = {
      $in: links.map((l) => l.personId),
    };
  }

  // ─────────────────────────────
  // INVITE MODE (FIX IMPORTANT)
  // ─────────────────────────────
  else if (sharedPersonIds && sharedPersonIds.length > 0) {
    console.log('mode invte')

    baseFilter._id = {
      $in: sharedPersonIds,
    };
  }

  // ─────────────────────────────
  // PUBLIC
  // ─────────────────────────────
  else {
    console.log('mode public')
    baseFilter._id = { $in: [] };
  }

  const persons = await db
    .collection("persons")
    .find(baseFilter)
    .limit(10)
    .toArray();

  return new Response(JSON.stringify(persons), {
    headers: { "Content-Type": "application/json" },
  });
};