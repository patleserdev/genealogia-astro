import type { APIRoute } from "astro";
import { db } from "../../../lib/mongo.ts";
import { verifyToken } from "../../../lib/auth";
import { ObjectId } from "mongodb";

export const GET: APIRoute = async ({ url, cookies }) => {
  const q = url.searchParams.get("q") ?? "";

  const token = cookies.get("token")?.value;
  const inviteToken = url.searchParams.get("inviteToken");

  let mode: "OWNER" | "GUEST" | "PUBLIC" = "PUBLIC";
  let userId: ObjectId | null = null;
  let sharedPersonIds: ObjectId[] = [];

  // ─────────────────────────────
  // 1. USER CONNECTÉ (cookie)
  // ─────────────────────────────
  if (token) {
    try {
      const payload = verifyToken(token);
      mode = payload.role;
      userId = new ObjectId(payload.userId);
    } catch {
      return new Response(JSON.stringify([]), { status: 200 });
    }
  }

  // ─────────────────────────────
  // 2. INVITATION MODE
  // ─────────────────────────────
  if (!token && inviteToken) {
    const inv = await db.collection("invitations").findOne({
      token: inviteToken,
      status: "PENDING",
    });

    if (inv) {
      mode = "GUEST";
      sharedPersonIds = (inv.sharedPersonIds ?? []).map(
        (id: any) => new ObjectId(id)
      );
    }
  }

  // ─────────────────────────────
  // 3. BUILD QUERY
  // ─────────────────────────────
  const safeQ = q.trim()
  let filter: any = {
    active: true,
    $or: [
      { prenom: { $regex: `^${safeQ}`, $options: "i" } },
      { nom: { $regex: `^${safeQ}`, $options: "i" } },
    ]
  };

  // OWNER → tout
  if (mode === "OWNER") {
    // rien
  }

  // GUEST → invitation uniquement
  else if (mode === "GUEST") {
    filter._id = {
      $in: sharedPersonIds,
    };
  }

  // USER connecté → ses personnes
  else if (mode === "USER" && userId) {
    const links = await db.collection("user_persons")
      .find({ userId })
      .project({ personId: 1 })
      .toArray();

    filter._id = {
      $in: links.map(l => l.personId),
    };
  }

  // PUBLIC + inviteToken valide MAIS sans mode GUEST mal détecté
  else if (inviteToken && sharedPersonIds.length > 0) {
    filter._id = {
      $in: sharedPersonIds,
    };
  }

  // PUBLIC pur
  else {
    // soit tout autoriser :
    // rien

    // soit bloquer :
    // filter._id = { $in: [] }
  }
  // ─────────────────────────────
  // 4. EXECUTE
  // ─────────────────────────────
  const persons = await db.collection("persons")
    .find(filter)
    .limit(10)
    .toArray();

  return new Response(JSON.stringify(persons), {
    headers: { "Content-Type": "application/json" },
  });
};