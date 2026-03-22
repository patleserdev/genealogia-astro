// src/lib/session.ts — helper pour récupérer l'utilisateur
import { verifyToken } from './auth'
import type { AstroGlobal } from 'astro'

export const getUser = (Astro: AstroGlobal) => {
  try {
    const token = Astro.cookies.get('token')?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}