// src/pages/api/change-requests/review.ts
// OWNER accepte ou refuse une demande
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { changeRequests, notifications, persons, user_persons } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

function toPerson(data: any) {
  return {
    active: true,
    prenom: data.prenom ?? '',
    nom: data.nom ?? '',
    email: data.email ?? null,
    dateNaissance: data.dateNaissance ?? null,
    dateDeces: data.dateDeces ?? null,
    sexe: data.sexe ?? null,
    notes: data.notes ?? null,
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('token')?.value


  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  const payload = verifyToken(token)
  if (payload.role !== 'OWNER')
    return new Response(JSON.stringify({ error: 'Réservé au propriétaire' }), { status: 403 })

  const { changeRequestId, decision, reviewNote } = await request.json()
  // decision : "ACCEPTED" | "REJECTED"

  if (!['ACCEPTED', 'REJECTED'].includes(decision))
    return new Response(JSON.stringify({ error: 'Décision invalide' }), { status: 400 })

  const cr = await changeRequests.findOne({
    _id: new ObjectId(changeRequestId),
    ownerId: new ObjectId(payload.userId),
    status: 'PENDING',
  })
  if (!cr)
    return new Response(JSON.stringify({ error: 'Demande introuvable' }), { status: 404 })
  let personIdToUse = cr.personId

  if (decision === 'ACCEPTED') {
    if (cr.type === 'CREATE_PERSON') {

      const result = await persons.insertOne(toPerson(cr.proposedData))

      personIdToUse = result.insertedId
      // OWNER
      await user_persons.insertOne({
        userId: cr.ownerId,
        personId: personIdToUse,
        role: 'owner',
        source: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // 👉 DEMANDEUR (CE QUI MANQUE)
      await user_persons.insertOne({
        userId: cr.requestedByUserId,
        personId: personIdToUse,
        role: 'viewer',
        source: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // ✅ AJOUT MANQUANT (EDIT)
    else if (cr.type === 'UPDATE_PERSON' && cr.personId) {
      await persons.updateOne(
        { _id: cr.personId },
        { $set: cr.proposedData }
      )
    }
  }

  // 🔔 NOTIFICATION DEMANDEUR
  await notifications.insertOne({
    userId: cr.requestedByUserId,
    type: "CHANGE_REQUEST",
    title:
      decision === "ACCEPTED"
        ? "Demande acceptée"
        : "Demande refusée",
    message:
      decision === "ACCEPTED"
        ? "Votre demande de modification a été acceptée"
        : `Votre demande a été refusée${reviewNote ? ` : ${reviewNote}` : ""}`,
    read: false,
    changeRequestId: cr._id,
    personId: personIdToUse,
    createdAt: new Date(),
  })

  await changeRequests.updateOne({ _id: cr._id }, {
    $set: { personId: personIdToUse, status: decision, reviewedAt: new Date(), reviewNote: reviewNote ?? null }
  })




  return new Response(JSON.stringify({ ok: true }))
}