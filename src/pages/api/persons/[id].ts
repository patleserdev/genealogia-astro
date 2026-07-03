import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import { changeRequests, persons, relations, user_persons } from "../../../lib/mongo.ts";
import { verifyToken } from "../../../lib/auth.ts";

export const PATCH: APIRoute = async ({ cookies, params, request }) => {

  const token = cookies.get("token")?.value;
  if (!token) return new Response("unauthorized", { status: 401 });
  let payload;
  try { payload = verifyToken(token); } catch { return new Response("invalid token", { status: 401 }); }
  if (payload.role === "GUEST") return new Response("forbidden", { status: 403 });

  const id = params.id;
  if (!id) return new Response("ID manquant", { status: 400 });

  const body = await request.json();

  const update: any = {};
  if (body.prenom) update.prenom = body.prenom.trim().toLowerCase();
  if (body.nom) update.nom = body.nom.trim().toLowerCase();
  if (body.email !== undefined) update.email = body.email.trim().toLowerCase();
  if (body.dateNaissance !== undefined) update.dateNaissance = body.dateNaissance;
  if (body.dateDeces !== undefined) update.dateDeces = body.dateDeces;

  if (body.sexe) update.sexe = body.sexe;

  const result = await persons.updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );

  if (result.matchedCount === 0) {
    return new Response("Personne non trouvée", { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {

  const token = cookies.get("token")?.value;
  if (!token) return new Response("unauthorized", { status: 401 });
  let payload;
  try { payload = verifyToken(token); } catch { return new Response("invalid token", { status: 401 }); }
  if (payload.role === "GUEST") return new Response("forbidden", { status: 403 });

  const id = params.id;

  if (!id) return new Response("ID manquant", { status: 400 });

  const personObjectId = new ObjectId(id);

  // 1. supprimer la personne
  const result = await persons.deleteOne({ _id: personObjectId });

  if (result.deletedCount === 0) {
    return new Response("Personne non trouvée", { status: 404 });
  }

  // 2. supprimer les liens user-person
  await user_persons.deleteMany({
    personId: personObjectId,
  });

  // 3. supprimer les relations (dans les 2 sens)
  await relations.deleteMany({
    $or: [
      { fromPersonId: personObjectId },
      { toPersonId: personObjectId }
    ]
  });

  // 4. optionnel mais recommandé : nettoyer les change requests liées
  await changeRequests.deleteMany({
    personId: personObjectId
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};