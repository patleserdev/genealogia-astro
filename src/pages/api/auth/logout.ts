// src/pages/api/auth/logout.ts
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ cookies }) => {
  cookies.delete('token', { path: '/' })

  return new Response(null, {
    status: 302,
    headers: { Location: '/login' }
  })
}