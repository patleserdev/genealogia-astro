import { r as relations, d as db } from '../../../chunks/mongo_pJhMhjwv.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const personId = new ObjectId(params.id);
  const relations2 = await db.collection("relations").find({
    $or: [{ from: personId }, { to: personId }]
  }).toArray();
  const linkedIds = relations2.map(
    (r) => r.from.equals(personId) ? r.to : r.from
  );
  const persons = await db.collection("persons").find({ _id: { $in: linkedIds } }).toArray();
  const byId = Object.fromEntries(persons.map((p) => [p._id.toString(), p]));
  const parents = relations2.filter((r) => r.type === "PARENT" && r.to.equals(personId)).map((r) => byId[r.from.toString()]).filter(Boolean);
  const enfants = relations2.filter((r) => r.type === "PARENT" && r.from.equals(personId)).map((r) => byId[r.to.toString()]).filter(Boolean);
  const conjoints = relations2.filter((r) => r.type === "CONJOINT").map((r) => byId[(r.from.equals(personId) ? r.to : r.from).toString()]).filter(Boolean);
  return new Response(JSON.stringify({ parents, enfants, conjoints }));
};
const PATCH = async ({ request, params }) => {
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
    dateDebut: body.dateDebut ?? void 0,
    dateFin: body.dateFin ?? void 0,
    ...body.coupleRelationId ? { coupleRelationId: new ObjectId(body.coupleRelationId) } : {}
  };
  await relations.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...payload } }
  );
  return new Response(JSON.stringify({ _id: params.id, status }), { status: 200 });
};
const DELETE = async ({ params }) => {
  await relations.deleteOne({ _id: new ObjectId(params.id) });
  return new Response(null, { status: 204 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
