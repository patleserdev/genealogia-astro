// src/pages/api/debug/me.ts — temporaire
import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'

export const prerender = false

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('token')?.value
  const payload = verifyToken(token!)
  return new Response(JSON.stringify(payload, null, 2))
}