// src/pages/api/invitations/list.ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { invitations } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  const payload = verifyToken(token)
  if (payload.role !== 'OWNER')
    return new Response(JSON.stringify({ error: 'Réservé au propriétaire' }), { status: 403 })

  const list = await invitations
    .find({ fromUserId: new ObjectId(payload.userId) })
    .sort({ createdAt: -1 })
    .toArray()

  return new Response(JSON.stringify(list))
}