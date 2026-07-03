import type { APIRoute } from "astro";
import {
  users,
  user_persons,
  invitations,
  changeRequests,
} from "../../../lib/mongo";
import { verifyToken } from "../../../lib/auth";
import { ObjectId } from "mongodb";

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
  }

  if (payload.role !== "OWNER") {
    return new Response(JSON.stringify({ error: "Réservé au propriétaire" }), { status: 403 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });
  }

  let targetId: ObjectId;
  try {
    targetId = new ObjectId(id);
  } catch {
    return new Response(JSON.stringify({ error: "ID invalide" }), { status: 400 });
  }

  const body = await request.json();

  const update: Record<string, unknown> = {};

  if (body.prenom !== undefined) update.prenom = body.prenom.trim();
  if (body.nom !== undefined) update.nom = body.nom.trim();

  if (body.email !== undefined) {
    const normalizedEmail = body.email.trim().toLowerCase();

    // vérifier que l'email n'est pas déjà pris par un autre compte
    const existing = await users.findOne({
      email: normalizedEmail,
      _id: { $ne: targetId },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Cet email est déjà utilisé par un autre compte" }),
        { status: 400 }
      );
    }

    update.email = normalizedEmail;
  }

  if (body.role !== undefined) {
    if (!["OWNER", "GUEST"].includes(body.role)) {
      return new Response(JSON.stringify({ error: "Rôle invalide" }), { status: 400 });
    }

    // empêcher l'owner de se rétrograder lui-même
    if (targetId.toString() === payload.userId && body.role !== "OWNER") {
      return new Response(
        JSON.stringify({ error: "Vous ne pouvez pas retirer votre propre rôle owner" }),
        { status: 400 }
      );
    }

    update.role = body.role;
  }

  update.updatedAt = new Date();

  const result = await users.updateOne({ _id: targetId }, { $set: update });

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // ── AUTH ──────────────────────────────────────────────
  const token = cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
  }

  if (payload.role !== "OWNER") {
    return new Response(JSON.stringify({ error: "Réservé au propriétaire" }), { status: 403 });
  }

  // ── VALIDATION ID ─────────────────────────────────────
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });
  }

  let userId: ObjectId;
  try {
    userId = new ObjectId(id);
  } catch {
    return new Response(JSON.stringify({ error: "ID invalide" }), { status: 400 });
  }

  // empêcher un owner de se supprimer lui-même
  if (userId.toString() === payload.userId) {
    return new Response(
      JSON.stringify({ error: "Vous ne pouvez pas supprimer votre propre compte" }),
      { status: 400 }
    );
  }

  try {
    // 🔒 1. récupérer le user cible
    const targetUser = await users.findOne({ _id: userId });

    if (!targetUser) {
      return new Response(JSON.stringify({ error: "User introuvable" }), { status: 404 });
    }

    // 🚫 2. INTERDICTION DE SUPPRIMER UN OWNER
    if (targetUser.role === "OWNER") {
      return new Response(
        JSON.stringify({ error: "Impossible de supprimer un OWNER" }),
        { status: 403 }
      );
    }

    // 🧹 3. cleanup user_persons
    await user_persons.deleteMany({ userId });

    // 🧹 4. cleanup invitations
    // (fromUserId ne matchera rien pour un GUEST, seuls les OWNER créent des
    // invitations ; on garde la condition par sécurité si ça change un jour)
    await invitations.deleteMany({
      $or: [{ fromUserId: userId }, { acceptedByUserId: userId }],
    });

    // 🧹 5. cleanup change requests (moderations)
    await changeRequests.deleteMany({
      $or: [{ ownerId: userId }, { requestedByUserId: userId }],
    });

    // 🗑️ 6. hard delete user
    await users.deleteOne({ _id: userId });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? "Erreur serveur" }),
      { status: 500 }
    );
  }
};