// src/pages/api/invitations/create.ts
import type { APIRoute } from 'astro'
import { randomBytes } from 'crypto'
import { ObjectId } from 'mongodb'
import { invitations, users } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 })
  }

  if (payload.role !== 'OWNER')
    return new Response(JSON.stringify({ error: 'Réservé au propriétaire' }), { status: 403 })

  const { email, sharedPersonIds = [] } = await request.json()
  if (!email?.trim())
    return new Response(JSON.stringify({ error: 'Email requis' }), { status: 400 })

  
  const normalizedEmail = email.toLowerCase().trim()

  const safeShared = Array.isArray(sharedPersonIds)
  ? sharedPersonIds.map(id => new ObjectId(id))
  : []

  const fromUserId = new ObjectId(payload.userId)

  // ── Cas 1 : l'user existe déjà ──────────────────────────
  const existingUser = await users.findOne({ email: normalizedEmail })

  if (existingUser) {
    // Déjà guest de cet owner ?
    if (existingUser.invitedBy?.toString() === payload.userId)
      return new Response(JSON.stringify({
        error: 'Cet utilisateur a déjà accès à votre arbre'
      }), { status: 400 })

    // Déjà guest de quelqu'un d'autre → on refuse
    if (existingUser.invitedBy)
      return new Response(JSON.stringify({
        error: 'Cet utilisateur est déjà rattaché à un autre arbre'
      }), { status: 400 })

    // Lien direct sans invitation
    await users.updateOne(
      { _id: existingUser._id },
      { $set: { role: 'GUEST', invitedBy: fromUserId } }
    )

    return new Response(JSON.stringify({
      ok: true,
      direct: true,
      message: `${existingUser.prenom} ${existingUser.nom} a maintenant accès à votre arbre.`
    }), { status: 201 })
  }

  // ── Cas 2 : l'user n'existe pas → invitation classique ──
  const already = await invitations.findOne({
    fromUserId,
    toEmail: normalizedEmail,
    status: 'PENDING',
  })
  if (already)
    return new Response(JSON.stringify({
      error: 'Une invitation est déjà en attente pour cet email'
    }), { status: 400 })

  const inv = await invitations.insertOne({
    fromUserId,
    toEmail:   normalizedEmail,
    token:     randomBytes(32).toString('hex'),
    status:    'PENDING',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sharedPersonIds: safeShared, // 👈 IMPORTANT

  })

  const created = await invitations.findOne({ _id: inv.insertedId })

  return new Response(JSON.stringify({
    ok: true,
    direct: false,
    invitationLink: `/invite?token=${created!.token}`
  }), { status: 201 })
}