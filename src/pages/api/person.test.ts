import { describe, it, expect, vi, beforeEach } from "vitest"
import { ObjectId } from "mongodb"

// ⚠️ MOCKS AVANT IMPORTS
vi.mock("../../lib/mongo", () => ({
  persons: {
    insertOne: vi.fn(),
  },
  user_persons: {
    insertOne: vi.fn(),
  },
  relations: {
    insertOne: vi.fn(),
  },
  changeRequests: {
    insertOne: vi.fn(),
  },
}))

vi.mock("../../lib/auth", () => ({
  verifyToken: vi.fn(),
}))

// 👉 IMPORT APRES MOCKS
import { POST } from "./persons.ts"
import { persons } from "../../lib/mongo"
import { verifyToken } from "../../lib/auth"

describe("/api/persons POST", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("crée une personne", async () => {
    ;(verifyToken as any).mockReturnValue({
      role: "ADMIN",
      userId: "507f1f77bcf86cd799439011",
    })

    ;(persons.insertOne as any).mockResolvedValue({
      insertedId: "abc",
    })

    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({
        prenom: " Jean ",
        nom: " Dupont ",
        email: " TEST@MAIL.COM ",
        sexe: "M",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST({
      request,
      cookies: {
        get: vi.fn().mockReturnValue({
          value: "valid-token",
        }),
      },
    } as any)

    expect(response.status).toBe(201)
    expect(persons.insertOne).toHaveBeenCalled()
  })
})