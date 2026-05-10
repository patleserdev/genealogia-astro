// src/pages/api/persons/index.ts
import type { APIRoute } from "astro";
import { db, persons, user_persons } from "../../lib/mongo";
import type { Person } from "../../models/Person";
import { verifyToken } from "../../lib/auth";
import { ObjectId } from "mongodb";

export const prerender = false;

/**
export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token)
    return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
  }

  const userId = new ObjectId(payload.userId);

  // 🔹 1. récupérer les accès
  const links = await user_persons
    .find({ userId })
    .project({ personId: 1, role: 1 })
    .toArray();

  if (links.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  // 🔹 2. récupérer les persons
  const personIds = links.map(l => l.personId);

  const data = await persons.find({
    _id: { $in: personIds },
    active: true
  }).toArray();

  // 🔹 3. enrichir avec permissions
  const enriched = data.map((p) => {
    const link = links.find(l => l.personId.toString() === p._id.toString());

    return {
      ...p,
      links,
      _permission:
        link?.role === "owner" || link?.role === "editor"
          ? "WRITE"
          : "READ",
    };
  });

  return new Response(JSON.stringify(enriched), { status: 200 });
};
**/

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value
  if (!token) return new Response("unauthorized", { status: 401 })

  const payload = verifyToken(token)
  const userId = new ObjectId(payload.userId)

  const links = await user_persons.find({ userId }).toArray()
  const personIds = links.map(l => l.personId)

  const data = await persons.find({
    _id: { $in: personIds },
    active: true
  }).toArray()

  return new Response(JSON.stringify(data), { status: 200 })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token)
    return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
  }

  if (payload.role === "GUEST")
    return new Response(
      JSON.stringify({ error: "Action non autorisée. Utilisez une demande de modification." }),
      { status: 403 }
    );

  const body = await request.json();

  const newPerson = {
    active: true,
    prenom: body.prenom.trim().toLowerCase(),
    nom: body.nom.trim().toLowerCase(),
    email: body.email?.trim().toLowerCase(),
    dateNaissance: body.dateNaissance,
    dateDeces: body.dateDeces,
    sexe: body.sexe,
    notes: body.notes,
  };

  const result = await persons.insertOne(newPerson);

  // 🔥 IMPORTANT : lien user_persons
  await user_persons.insertOne({
    userId: new ObjectId(payload.userId),
    personId: result.insertedId,
    role: "owner",
    source: "created",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return new Response(
    JSON.stringify({ ...newPerson, _id: result.insertedId }),
    { status: 201 }
  );
};