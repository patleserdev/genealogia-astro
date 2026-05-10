// src/pages/api/change-requests/create.ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { changeRequests, users } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  const payload = verifyToken(token)

  // OWNER peut aussi proposer (sur son propre arbre = modification directe, mais on garde le même flux)
  const { type, personId, proposedData, relationsData } = await request.json()

  if (!["CREATE_PERSON",
    "UPDATE_PERSON",
    "DELETE_PERSON",
    "CREATE_RELATION",
    "UPDATE_RELATION",
    "DELETE_RELATION"
  ].includes(type))
    return new Response(JSON.stringify({ error: 'Type invalide' }), { status: 400 })

  if (type === 'UPDATE_PERSON' && !personId)
    return new Response(JSON.stringify({ error: 'personId requis pour UPDATE_PERSON' }), { status: 400 })

  // Trouve le owner (invitedBy si GUEST, lui-même si OWNER)
  const ownerId = payload.role === 'GUEST'
    ? new ObjectId(payload.invitedBy!)
    : new ObjectId(payload.userId)

  await changeRequests.insertOne({
    requestedByUserId: new ObjectId(payload.userId),
    ownerId,
    type,
    personId: personId ? new ObjectId(personId) : undefined,
    proposedData,
    relationsData,
    status: 'PENDING',
    createdAt: new Date(),
  })

  return new Response(JSON.stringify({ ok: true }), { status: 201 })
}