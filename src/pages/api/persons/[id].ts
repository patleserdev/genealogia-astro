import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import { persons } from "../../../lib/mongo.ts";

export const PATCH: APIRoute = async ({ params, request }) => {
    const id = params.id;
    if (!id) return new Response("ID manquant", { status: 400 });
  
    const body = await request.json();
  
    const update: any = {};
    if (body.prenom) update.prenom = body.prenom.trim().toLowerCase();
    if (body.nom) update.nom = body.nom.trim().toLowerCase();
    if (body.email !== undefined) update.email = body.email.trim().toLowerCase();
    if (body.dateNaissance !== undefined) update.dateNaissance = body.dateNaissance;
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
  
  export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
  
    if (!id) return new Response("ID manquant", { status: 400 });
  
    const result = await persons.deleteOne({ _id: new ObjectId(id) });
  
    if (result.deletedCount === 0) {
      return new Response("Personne non trouvée", { status: 404 });
    }
  
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };