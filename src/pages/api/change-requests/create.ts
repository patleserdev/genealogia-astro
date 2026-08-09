// src/pages/api/change-requests/create.ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { changeRequests, users } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'
import { emailService } from '../../../services/email/email.service'

const TYPE_LABELS: Record<string, string> = {
  CREATE_PERSON: 'ajouter une nouvelle personne',
  UPDATE_PERSON: 'modifier une personne',
  DELETE_PERSON: 'supprimer une personne',
  CREATE_RELATION: 'ajouter une relation',
  UPDATE_RELATION: 'modifier une relation',
  DELETE_RELATION: 'supprimer une relation',
}

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

  const inserted = await changeRequests.insertOne({
    requestedByUserId: new ObjectId(payload.userId),
    ownerId,
    type,
    personId: personId ? new ObjectId(personId) : undefined,
    proposedData,
    relationsData,
    status: 'PENDING',
    createdAt: new Date(),
  })

  // 👉 Notifie le OWNER par mail, seulement si la demande vient d'un GUEST
  // (si c'est le OWNER lui-même qui la crée, pas besoin de le prévenir)
  if (payload.role === 'GUEST') {
    try {
      const owner = await users.findOne({ _id: ownerId })

      if (owner?.email) {
        const actionDescription = `${payload.prenom} ${payload.nom} souhaite ${TYPE_LABELS[type] ?? type}`
        const moderationLink = `${process.env.PUBLIC_APP_URL ?? 'http://localhost:4321'}/change-requests/${inserted.insertedId.toString()}`

        await emailService.sendModerationNotification(
          owner.email,
          actionDescription,
          moderationLink
        )
      }
    } catch (err) {
      console.error('Échec envoi mail notification de modération:', err)
      // on ne bloque pas la création de la demande si le mail échoue
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 201 })
}