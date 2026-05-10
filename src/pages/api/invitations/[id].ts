// src/pages/api/invitations/[id].ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { invitations } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

export const prerender = false

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  const payload = verifyToken(token)
  if (payload.role !== 'OWNER')
    return new Response(JSON.stringify({ error: 'Interdit' }), { status: 403 })

  await invitations.deleteOne({
    _id:        new ObjectId(params.id),
    fromUserId: new ObjectId(payload.userId), // sécurité : ne peut supprimer que les siennes
  })

  return new Response(JSON.stringify({ ok: true }))
}