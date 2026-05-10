import { describe, it, expect, vi, beforeEach } from "vitest"

// ⚠️ IMPORTANT : mock AVANT d'importer l'API
vi.mock("../../../lib/mongo.ts", () => ({
  persons: {
    deleteOne: vi.fn(),
    updateOne: vi.fn(),
  },
  user_persons: {
    deleteMany: vi.fn(),
  },
  relations: {
    deleteMany: vi.fn(),
  },
  changeRequests: {
    deleteMany: vi.fn(),
  },
}))

import { DELETE } from "./[id]"
import { persons, user_persons, relations, changeRequests } from "../../../lib/mongo.ts"

function mockContext(id: string) {
  return {
    params: { id },
  } as any
}

describe("DELETE /api/persons/:id", () => {
  const id = "507f1f77bcf86cd799439011"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("supprime une personne + relations + user_persons + changeRequests", async () => {
    // mock delete personne OK
    ;(persons.deleteOne as any).mockResolvedValue({ deletedCount: 1 })

    const res = await DELETE(mockContext(id))

    expect(persons.deleteOne).toHaveBeenCalledWith({
      _id: expect.any(Object),
    })

    expect(user_persons.deleteMany).toHaveBeenCalled()
    expect(relations.deleteMany).toHaveBeenCalled()
    expect(changeRequests.deleteMany).toHaveBeenCalled()

    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it("retourne 404 si personne inexistante", async () => {
    ;(persons.deleteOne as any).mockResolvedValue({ deletedCount: 0 })

    const res = await DELETE(mockContext(id))

    expect(res.status).toBe(404)
  })
})