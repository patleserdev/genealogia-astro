import { r as relations } from '../../../chunks/mongo_Dkx7giOQ.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const PATCH = async ({ request, params }) => {
  const body = await request.json();
  const { status } = body;
  if (!status || !["ACTIVE", "DIVORCED"].includes(status)) {
    return new Response("Statut invalide", { status: 400 });
  }
  await relations.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status } }
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
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
