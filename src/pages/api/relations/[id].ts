import type { APIRoute } from "astro";
import { relations } from "../../../lib/mongo";
import { ObjectId } from "mongodb";
import type { Relation } from "../../../models/Relation";
export const prerender = false;

export const PATCH: APIRoute = async ({ request, params }) => {
  const body = await request.json();
  const { status } = body;

  const payload = {
    ...body,
    from: new ObjectId(body.from),
    to: new ObjectId(body.to),
    dateDebut: body.dateDebut ? new Date(body.dateDebut) : null,
    dateFin: body.dateFin ? new Date(body.dateFin) : null,
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