import { ObjectId } from 'mongodb';
import { p as persons } from '../../../chunks/mongo_pJhMhjwv.mjs';
export { renderers } from '../../../renderers.mjs';

const PATCH = async ({ params, request }) => {
  const id = params.id;
  if (!id) return new Response("ID manquant", { status: 400 });
  const body = await request.json();
  const update = {};
  if (body.prenom) update.prenom = body.prenom.trim().toLowerCase();
  if (body.nom) update.nom = body.nom.trim().toLowerCase();
  if (body.email !== void 0) update.email = body.email.trim().toLowerCase();
  if (body.dateNaissance !== void 0) update.dateNaissance = body.dateNaissance;
  if (body.dateDeces !== void 0) update.dateDeces = body.dateDeces;
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
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
