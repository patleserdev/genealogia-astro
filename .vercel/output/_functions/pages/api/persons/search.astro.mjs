import { d as db } from '../../../chunks/mongo_pJhMhjwv.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ url }) => {
  const q = url.searchParams.get("q") ?? "";
  const persons = await db.collection("persons").find({
    active: true,
    $or: [
      { prenom: { $regex: q, $options: "i" } },
      { nom: { $regex: q, $options: "i" } }
    ]
  }).limit(10).toArray();
  return new Response(JSON.stringify(persons));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
