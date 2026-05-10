// src/pages/api/debug/cr.ts — À SUPPRIMER APRÈS
import type { APIRoute } from 'astro'
import { db } from '../../../lib/mongo'

export const prerender = false

export const GET: APIRoute = async () => {
  const all = await db.collection('change_requests').find().toArray()
  return new Response(JSON.stringify(all, null, 2))
}