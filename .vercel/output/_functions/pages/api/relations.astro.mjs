import { r as relations } from '../../chunks/mongo_pJhMhjwv.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const data = await relations.find().toArray();
  return new Response(JSON.stringify(data), { status: 200 });
};
const POST = async ({ request }) => {
  const body = await request.json();
  if (body.from === body.to) {
    return new Response(
      JSON.stringify({ error: "Une personne ne peut pas avoir une relation avec elle-même." }),
      { status: 400 }
    );
  }
  const newRelation = {
    from: new ObjectId(body.from),
    to: new ObjectId(body.to),
    type: body.type,
    status: body.status,
    dateDebut: body.dateDebut ?? void 0,
    dateFin: body.dateFin ?? void 0,
    ...body.coupleRelationId ? { coupleRelationId: new ObjectId(body.coupleRelationId) } : {}
  };
  await relations.insertOne(newRelation);
  return new Response(JSON.stringify(newRelation), { status: 201 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
