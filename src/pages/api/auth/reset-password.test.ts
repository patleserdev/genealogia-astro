import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'

import { POST } from './reset-password'
const { findOneMock, updateOneMock, sendPasswordChangedMock } = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  updateOneMock: vi.fn(),
  sendPasswordChangedMock: vi.fn(),
}))


vi.mock('../../../lib/mongo', () => ({
  db: {
    collection: vi.fn((name: string) => {
      if (name === 'password_resets') {
        return {
          findOne: findOneMock,
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

vi.mock('../../../services/email/email.service', () => ({
  emailService: {
    sendPasswordChanged: sendPasswordChangedMock,
  },
}))

describe('/api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ... tes tests existants inchangés jusqu'à celui-ci ...

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

    // 👉 nouveau : vérifie que le mail de confirmation part bien, au bon email
    expect(sendPasswordChangedMock).toHaveBeenCalledTimes(1)
    expect(sendPasswordChangedMock).toHaveBeenCalledWith('test@test.com')
  })

  it("n'envoie pas de mail si le token est invalide", async () => {
    findOneMock.mockResolvedValueOnce(null)

    const request = new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'test123',
      }),
    })

    await POST({ request } as any)

    expect(sendPasswordChangedMock).not.toHaveBeenCalled()
  })
})