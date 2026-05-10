import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./create"
import { changeRequests } from "../../../lib/mongo"
import { verifyToken } from "../../../lib/auth"

vi.mock("../../../lib/auth", () => ({
  verifyToken: vi.fn(),
}))

vi.mock("../../../lib/mongo", () => ({
  changeRequests: {
    insertOne: vi.fn(),
  },
  users: {},
}))

describe("/api/change-requests/create", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("crée une change request CREATE_PERSON pour un OWNER", async () => {
    // ✅ IMPORTANT : ObjectId valide
    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439011",
      role: "OWNER",
    })

    ;(changeRequests.insertOne as any).mockResolvedValue({
      insertedId: "cr1",
    })

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        type: "CREATE_PERSON",
        proposedData: { prenom: "Jean" },
        relationsData: [],
      }),
    })

    const response = await POST({
      request,
      cookies: {
        get: () => ({ value: "token123" }),
      },
    } as any)

    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.ok).toBe(true)

    expect(changeRequests.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedByUserId: expect.any(Object),
        ownerId: expect.any(Object),
        type: "CREATE_PERSON",
        status: "PENDING",
      })
    )
  })

  it("refuse un type invalide", async () => {
    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439011",
      role: "OWNER",
    })

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        type: "DELETE",
        proposedData: {},
      }),
    })

    const response = await POST({
      request,
      cookies: {
        get: () => ({ value: "token123" }),
      },
    } as any)

    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Type invalide")
  })
})