import { ObjectId } from 'mongodb';
import { d as db } from '../../../chunks/mongo_pJhMhjwv.mjs';
import { v as verifyToken } from '../../../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../../../renderers.mjs';

const PATCH = async ({ cookies, request }) => {
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
  const { prenom, nom, dateNaissance, sexe, notes } = await request.json();
  if (user.personId) {
    await db.collection("persons").updateOne(
      { _id: user.personId },
      { $set: {
        ...prenom && { prenom },
        ...nom && { nom },
        ...dateNaissance && { dateNaissance },
        ...sexe && { sexe },
        ...notes !== void 0 && { notes }
      } }
    );
  }
  await db.collection("users").updateOne(
    { _id: new ObjectId(payload.userId) },
    { $set: { prenom, nom } }
  );
  return new Response(JSON.stringify({ ok: true }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
