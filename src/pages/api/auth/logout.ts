// src/pages/api/auth/logout.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('token', { path: '/' })
  return new Response(JSON.stringify({ ok: true }))
}