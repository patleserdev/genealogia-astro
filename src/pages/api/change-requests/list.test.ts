import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "./list"
import { verifyToken } from "../../../lib/auth"
import { changeRequests } from "../../../lib/mongo"

vi.mock("../../../lib/auth", () => ({
  verifyToken: vi.fn(),
}))

vi.mock("../../../lib/mongo", () => ({
  changeRequests: {
    find: vi.fn(),
  },
}))

describe("GET /api/change-requests/list", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(url = "http://localhost/api/change-requests/list") {
    return {
      cookies: {
        get: () => ({ value: "fake-token" }),
      },
      url: new URL(url),
    } as any
  }

  it("retourne les change requests OWNER", async () => {
    const toArrayMock = vi.fn().mockResolvedValue([
      {
        _id: "abc123",
        ownerId: "507f1f77bcf86cd799439011",
        status: "PENDING",
      },
    ])

    ;(changeRequests.find as any).mockReturnValue({
      toArray: toArrayMock,
    })

    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439011",
      role: "OWNER",
    })

    const res = await GET(createRequest())
    const data = await res.json()

    expect(data).toEqual([
      {
        _id: "abc123",
        ownerId: "507f1f77bcf86cd799439011",
        status: "PENDING",
      },
    ])

    expect(toArrayMock).toHaveBeenCalled()
  })

  it("filtre par status", async () => {
    const toArrayMock = vi.fn().mockResolvedValue([])

    const findMock = vi.fn(() => ({
      toArray: toArrayMock,
    }))

    ;(changeRequests.find as any) = findMock

    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439011",
      role: "OWNER",
    })

    await GET(
      createRequest("http://localhost/api/change-requests/list?status=PENDING")
    )

    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PENDING",
      })
    )
  })
})