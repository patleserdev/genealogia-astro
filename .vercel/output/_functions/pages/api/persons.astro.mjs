import { persons } from '../../chunks/mongo_DDLBCJZd.mjs';
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
    email: body.email?.trim().toLowerCase(),
    dateNaissance: body.dateNaissance,
    dateDeces: body.dateDeces,
    sexe: body.sexe
  };
  await persons.insertOne(newPerson);
  return new Response(JSON.stringify(newPerson), { status: 201 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
