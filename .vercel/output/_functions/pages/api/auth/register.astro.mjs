import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { db } from '../../../chunks/mongo_DDLBCJZd.mjs';
export { renderers } from '../../../renderers.mjs';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const POST = async ({ request }) => {
  const { prenom, nom, email, dateNaissance, password, personId } = await request.json();
  if (!prenom?.trim() || !nom?.trim() || !email?.trim() || !password) {
    return new Response(JSON.stringify({ error: "Tous les champs sont requis" }), { status: 400 });
  }
  if (!PASSWORD_REGEX.test(password)) {
    return new Response(JSON.stringify({
      error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
    }), { status: 400 });
  }
  const exists = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    return new Response(JSON.stringify({ error: "Email déjà utilisé" }), { status: 400 });
  }
  let linkedPersonId;
  if (personId) {
    linkedPersonId = new ObjectId(personId);
    const person = await db.collection("persons").findOne({ _id: linkedPersonId });
    if (!person) {
      return new Response(JSON.stringify({ error: "Profil introuvable" }), { status: 404 });
    }
    const normalize = (s) => s?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const prenomMatch = normalize(person.prenom) === normalize(prenom);
    const nomMatch = normalize(person.nom) === normalize(nom);
    const emailMatch = !person.email || normalize(person.email) === normalize(email);
    const dateMatch = !person.dateNaissance || person.dateNaissance === dateNaissance;
    if (!prenomMatch || !nomMatch) {
      return new Response(JSON.stringify({
        error: "Le prénom ou le nom ne correspond pas au profil sélectionné"
      }), { status: 400 });
    }
    if (!emailMatch) {
      return new Response(JSON.stringify({
        error: "L'email ne correspond pas au profil sélectionné"
      }), { status: 400 });
    }
    if (!dateMatch) {
      return new Response(JSON.stringify({
        error: "La date de naissance ne correspond pas au profil sélectionné"
      }), { status: 400 });
    }
    const alreadyLinked = await db.collection("users").findOne({ personId: linkedPersonId });
    if (alreadyLinked) {
      return new Response(JSON.stringify({ error: "Ce profil est déjà associé à un compte" }), { status: 400 });
    }
  } else {
    const result = await db.collection("persons").insertOne({
      active: true,
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: email.toLowerCase().trim(),
      dateNaissance: dateNaissance ?? null
    });
    linkedPersonId = result.insertedId;
  }
  const hashed = await bcrypt.hash(password, 12);
  await db.collection("users").insertOne({
    email: email.toLowerCase().trim(),
    prenom: prenom.trim(),
    nom: nom.trim(),
    password: hashed,
    personId: linkedPersonId,
    createdAt: /* @__PURE__ */ new Date()
  });
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
