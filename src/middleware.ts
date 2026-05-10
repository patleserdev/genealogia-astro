// src/middleware.ts
import { defineMiddleware } from 'astro:middleware'
import { verifyToken } from './lib/auth'

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/invite',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/debug',  // ← temporaire
  '/api/invitations/validate',
]

const PUBLIC_API_ROUTES = [
  '/api/persons/search',
  '/api/invitations/validate',
  '/api/invitations/accept',
]

const OWNER_ROUTES = [
  '/invitations',
  '/persons/add-with-relations',
  '/relations/add-quick',
  '/api/invitations/create',
  '/api/invitations/list',
  '/api/change-requests/review',
  '/api/users',
  '/users'
]

// Pages réservées aux guests (l'owner n'en a pas besoin)
const GUEST_ROUTES = [
  '/change-requests/new',
]

export const onRequest = defineMiddleware(async ({ request, cookies, redirect }, next) => {
  const url = new URL(request.url)
  const path = url.pathname

  // 1. Routes publiques → on laisse passer sans vérification
  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) return next()

  if (
    PUBLIC_ROUTES.some(r => path.startsWith(r)) ||
    PUBLIC_API_ROUTES.some(r => path.startsWith(r))
  ) {
    return next()
  }

  const isInvitePage = path.startsWith('/invite')

  if (isInvitePage) {
    return next()
  }
  // 2. Vérification du token
  const token = cookies.get('token')?.value
  if (!token) return redirect('/login')

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    return redirect('/login')
  }

  // 3. Routes owner → bloquer les guests
  if (OWNER_ROUTES.some(r => path.startsWith(r)) && payload.role !== 'OWNER') {
    if (path.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Accès refusé' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return redirect('/persons')
  }

  // 4. Routes guest → rediriger l'owner vers ses propres outils
  if (GUEST_ROUTES.some(r => path.startsWith(r)) && payload.role === 'OWNER') {
    return redirect('/persons')
  }

  return next()
})