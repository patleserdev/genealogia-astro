import { p as persons } from '../../chunks/mongo_Dkx7giOQ.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const data = await persons.find().toArray();
  return new Response(JSON.stringify(data), { status: 200 });
};
const POST = async ({ request }) => {
  const body = await request.json();
  const newPerson = {
    active: true,
    prenom: body.prenom.trim().toLowerCase(),
    nom: body.nom.trim().toLowerCase(),
    email: body.email.trim().toLowerCase(),
    dateNaissance: body.dateNaissance.trim().toLowerCase(),
    sexe: body.sexe
  };
  await persons.insertOne(newPerson);
  return new Response(JSON.stringify(newPerson), { status: 201 });
};
const PATCH = async ({ params, request }) => {
  const id = params.id;
  if (!id) return new Response("ID manquant", { status: 400 });
  const body = await request.json();
  const update = {};
  if (body.prenom) update.prenom = body.prenom.trim().toLowerCase();
  if (body.nom) update.nom = body.nom.trim().toLowerCase();
  if (body.email !== void 0) update.email = body.email.trim().toLowerCase();
  if (body.dateNaissance !== void 0) update.dateNaissance = body.dateNaissance;
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
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response("ID manquant", { status: 400 });
  const result = await persons.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return new Response("Personne non trouvée", { status: 404 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
