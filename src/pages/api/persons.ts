// src/pages/api/persons/index.ts
import type { APIRoute } from "astro";
import {
  db,
  persons,
  user_persons,
  users,
} from "../../lib/mongo";
import { verifyToken } from "../../lib/auth";
import { ObjectId } from "mongodb";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = verifyToken(token);
  const userId = new ObjectId(payload.userId);

  const links = await user_persons.find({ userId }).toArray();

  const personIds = links.map((l) => l.personId);

  const data = await persons
    .find({
      _id: { $in: personIds },
      active: true,
    })
    .toArray();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Non authentifié" }),
      { status: 401 }
    );
  }

  let payload;

  try {
    payload = verifyToken(token);
  } catch {
    return new Response(
      JSON.stringify({ error: "Token invalide" }),
      { status: 401 }
    );
  }

  if (payload.role === "GUEST") {
    return new Response(
      JSON.stringify({
        error:
          "Action non autorisée. Utilisez une demande de modification.",
      }),
      { status: 403 }
    );
  }

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

  // ─────────────────────────────
  // INSERT PERSON
  // ─────────────────────────────
  const result = await persons.insertOne(newPerson);

  const personId = result.insertedId;
  const ownerId = new ObjectId(payload.userId);

  // ─────────────────────────────
  // OWNER ACCESS
  // ─────────────────────────────
  const accessRows: any[] = [
    {
      userId: ownerId,
      personId,
      role: "owner",
      source: "created",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // ─────────────────────────────
  // USERS INVITED BY ME
  // ─────────────────────────────
  const invitedUsers = await users
    .find({
      invitedBy: ownerId,
    })
    .project({ _id: 1 })
    .toArray();

  for (const invitedUser of invitedUsers) {
    accessRows.push({
      userId: invitedUser._id,
      personId,
      role: "viewer",
      source: "inherit",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ─────────────────────────────
  // BULK INSERT ACCESS
  // ─────────────────────────────
  await user_persons.insertMany(accessRows);

  return new Response(
    JSON.stringify({
      ...newPerson,
      _id: personId,
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};