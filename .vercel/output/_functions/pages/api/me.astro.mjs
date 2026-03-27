import { ObjectId } from 'mongodb';
import { d as db } from '../../chunks/mongo_pJhMhjwv.mjs';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
  }
  const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
  const person = user.personId ? await db.collection("persons").findOne({ _id: user.personId }) : null;
  return new Response(JSON.stringify({
    user: { email: user.email, prenom: user.prenom, nom: user.nom },
    person: person ?? null
  }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
