import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'

import { POST } from './reset-password'

const findOneMock = vi.fn()
const updateOneMock = vi.fn()

vi.mock('../../../lib/mongo', () => ({
  db: {
    collection: vi.fn((name: string) => {
      if (name === 'password_resets') {
        return {
          findOne: findOneMock,
        }
      }

      if (name === 'passwordResets') {
        return {
          updateOne: updateOneMock,
        }
      }

      if (name === 'users') {
        return {
          findOne: findOneMock,
          updateOne: updateOneMock,
        }
      }

      return {}
    }),
  },
}))

describe('/api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne 400 si token manquant', async () => {
    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        password: 'test123',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Données invalides')
  })

  it('retourne 400 si token invalide', async () => {
    findOneMock.mockResolvedValueOnce(null)

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'test123',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token invalide')
  })

  it('retourne 400 si token expiré', async () => {
    findOneMock.mockResolvedValueOnce({
      _id: 'reset-id',
      token: 'expired-token',
      used: false,
      userId: 'user-id',
      expiresAt: new Date(Date.now() - 1000),
    })

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'expired-token',
        password: 'test123',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token expiré')
  })

  it('retourne 404 si utilisateur introuvable', async () => {
    findOneMock
      .mockResolvedValueOnce({
        _id: 'reset-id',
        token: 'valid-token',
        used: false,
        userId: 'missing-user',
        expiresAt: new Date(Date.now() + 100000),
      })
      .mockResolvedValueOnce(null)

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token',
        password: 'test123',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Utilisateur introuvable')
  })

  it("retourne 400 si l'utilisateur réutilise son ancien mot de passe", async () => {
    const hashedPassword = await bcrypt.hash('old-password', 10)

    findOneMock
      .mockResolvedValueOnce({
        _id: 'reset-id',
        token: 'valid-token',
        used: false,
        userId: 'user-id',
        expiresAt: new Date(Date.now() + 100000),
      })
      .mockResolvedValueOnce({
        _id: 'user-id',
        email: 'test@test.com',
        password: hashedPassword,
      })

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token',
        password: 'old-password',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe(
      'Vous ne pouvez pas réutiliser votre ancien mot de passe'
    )
  })

  it('met à jour le mot de passe et marque le token comme utilisé', async () => {
    const oldHashedPassword = await bcrypt.hash('old-password', 10)

    findOneMock
      .mockResolvedValueOnce({
        _id: 'reset-id',
        token: 'valid-token',
        used: false,
        userId: 'user-id',
        expiresAt: new Date(Date.now() + 100000),
      })
      .mockResolvedValueOnce({
        _id: 'user-id',
        email: 'test@test.com',
        password: oldHashedPassword,
      })

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token',
        password: 'new-password',
      }),
    })

    const response = await POST({ request } as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)

    expect(updateOneMock).toHaveBeenCalledTimes(2)
  })
})