import type { APIRoute } from "astro";
import { db, relations } from "../../lib/mongo";
import { ObjectId } from "mongodb";
import type { Relation } from "../../models/Relation";
export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await relations.find().toArray();
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  // Vérification : from et to ne doivent pas être identiques
  if (body.from === body.to) {
    return new Response(
      JSON.stringify({ error: "Une personne ne peut pas avoir une relation avec elle-même." }),
      { status: 400 }
    );
  }

  const newRelation: Relation = {
    from: new ObjectId(body.from),
    to: new ObjectId(body.to),
    type: body.type,
    status: body.status,
    dateDebut: body.dateDebut ?? undefined,
    dateFin: body.dateFin ?? undefined,
    ...(body.coupleRelationId ? { coupleRelationId: new ObjectId(body.coupleRelationId) } : {}),
  };

  await relations.insertOne(newRelation);

  return new Response(JSON.stringify(newRelation), { status: 201 });
};

export async function deleteRelation(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("INVALID_ID");
  }

  const result = await db.collection("relations").deleteOne({
    _id: new ObjectId(id)
  });

  if (result.deletedCount === 0) {
    throw new Error("NOT_FOUND");
  }

  return true;
}

