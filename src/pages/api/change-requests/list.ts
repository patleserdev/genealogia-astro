import type { APIRoute } from 'astro'
import type { Filter } from 'mongodb'
import { ObjectId } from 'mongodb'
import { changeRequests } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

// adapte si tu as déjà un type sinon laisse implicite Mongo
type ChangeRequest = {
  ownerId?: ObjectId
  requestedByUserId?: ObjectId
  status?: "PENDING" | "ACCEPTED" | "REJECTED"
  createdAt?: Date
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const token = cookies.get('token')?.value
  if (!token) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401,
    })
  }

  let payload: { userId: string; role: string }

  try {
    payload = verifyToken(token)
  } catch {
    return new Response(JSON.stringify({ error: 'Token invalide' }), {
      status: 401,
    })
  }

  const userId = new ObjectId(payload.userId)

  const query: Record<string, any> = {}

  if (payload.role === "OWNER") {
    query.ownerId = userId
  } else {
    query.requestedByUserId = userId
  }

  const status = url.searchParams.get("status")

  if (
    status === "PENDING" ||
    status === "ACCEPTED" ||
    status === "REJECTED"
  ) {
    query.status = status
  }

  const list = await changeRequests.find(query).toArray()
  return new Response(JSON.stringify(list), {
    headers: { 'Content-Type': 'application/json' },
  })
}