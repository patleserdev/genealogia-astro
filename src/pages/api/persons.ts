import type { APIRoute } from "astro";
import { persons } from "../../lib/mongo";
import type { Person } from "../../models/Person";
export const prerender = false;
export const GET: APIRoute = async () => {
  const data = await persons.find().toArray();
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  //nettoyage


  const newPerson: Person = {
    active:true,
    prenom: body.prenom.trim().toLowerCase(),
    nom: body.nom.trim().toLowerCase(),
    email:body.email.trim().toLowerCase(),
    dateNaissance: body.dateNaissance.trim().toLowerCase(),
    sexe: body.sexe,
  };

  await persons.insertOne(newPerson);

  return new Response(JSON.stringify(newPerson), { status: 201 });
};


