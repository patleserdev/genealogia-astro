import type { APIRoute } from "astro";
import { relations } from "../../../lib/mongo";
import { ObjectId } from "mongodb";
import type { Relation } from "../../../models/Relation";
export const prerender = false;

export const PATCH: APIRoute = async ({ request, params }) => {
  const body = await request.json();
  const { status } = body;

  if (body.from === body.to) {
    return new Response(
      JSON.stringify({ error: "Une personne ne peut pas avoir une relation avec elle-même." }),
      { status: 400 }
    );
  }
  
  const payload = {
    from: new ObjectId(body.from),
    to: new ObjectId(body.to),
    type: body.type,
    status: body.status,
    dateDebut: body.dateDebut ?? undefined,
    dateFin: body.dateFin ?? undefined,
    ...(body.coupleRelationId ? { coupleRelationId: new ObjectId(body.coupleRelationId) } : {}),
  };
  await relations.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...payload } }
  );

  return new Response(JSON.stringify({ _id: params.id, status }), { status: 200 });
};


export const DELETE: APIRoute = async ({ params }) => {
  await relations.deleteOne({ _id: new ObjectId(params.id) });
  return new Response(null, { status: 204 });
};