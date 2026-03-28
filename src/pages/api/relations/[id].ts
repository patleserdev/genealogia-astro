import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import { db } from "../../../lib/mongo.ts";

export const GET: APIRoute = async ({ params }) => {
  const personId = new ObjectId(params.id);

  const allRelations = await db.collection('relations').find({
    $or: [{ from: personId }, { to: personId }]
  }).toArray();

  // Collecter tous les IDs directs
  const linkedIds = allRelations.map(r =>
    r.from.equals(personId) ? r.to : r.from
  );

  // Récupérer aussi les seconds parents via coupleRelationId
  const parentRels = allRelations.filter(r =>
    r.type === 'PARENT' && r.to.equals(personId)
  );

  const extraParentIds: ObjectId[] = [];
  for (const rel of parentRels) {
    if (rel.coupleRelationId) {
      const coupleRel = await db.collection('relations').findOne({
        _id: rel.coupleRelationId
      });
      if (coupleRel) {
        const otherId = coupleRel.from.equals(rel.from)
          ? coupleRel.to
          : coupleRel.from;
        // N'ajouter que si pas déjà dans les relations directes
        if (!linkedIds.some(id => id.equals(otherId))) {
          extraParentIds.push(otherId);
        }
      }
    }
  }

  const allIds = [...linkedIds, ...extraParentIds];

  const persons = await db.collection('persons')
    .find({ _id: { $in: allIds } })
    .toArray();

  const byId = Object.fromEntries(persons.map(p => [p._id.toString(), p]));

  const parents = [
    // Parents directs
    ...allRelations
      .filter(r => r.type === 'PARENT' && r.to.equals(personId))
      .map(r => byId[r.from.toString()]),
    // Second parent via coupleRelationId
    ...extraParentIds.map(id => byId[id.toString()]),
  ].filter(Boolean);

  const enfants = allRelations
    .filter(r => r.type === 'PARENT' && r.from.equals(personId))
    .map(r => byId[r.to.toString()])
    .filter(Boolean);

  const conjoints = allRelations
    .filter(r => r.type === 'CONJOINT')
    .map(r => byId[(r.from.equals(personId) ? r.to : r.from).toString()])
    .filter(Boolean);

  return new Response(JSON.stringify({ parents, enfants, conjoints }), {
    headers: { 'Content-Type': 'application/json' }
  });
};