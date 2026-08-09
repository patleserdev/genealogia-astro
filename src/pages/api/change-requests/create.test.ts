import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./create"
import { changeRequests, users } from "../../../lib/mongo"
import { verifyToken } from "../../../lib/auth"

const { findOneMock, sendModerationNotificationMock } = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  sendModerationNotificationMock: vi.fn(),
}))

vi.mock("../../../lib/auth", () => ({
  verifyToken: vi.fn(),
}))


vi.mock("../../../lib/mongo", () => ({
  changeRequests: {
    insertOne: vi.fn(),
  },
  users: {
    findOne: findOneMock,
  },
}))


vi.mock("../../../services/email/email.service", () => ({
  emailService: {
    sendModerationNotification: sendModerationNotificationMock,
  },
}))

describe("/api/change-requests/create", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("crée une change request CREATE_PERSON pour un OWNER", async () => {
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

    // 👉 OWNER qui crée sa propre demande : pas de mail
    expect(sendModerationNotificationMock).not.toHaveBeenCalled()
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

    expect(sendModerationNotificationMock).not.toHaveBeenCalled()
  })

  it("notifie le OWNER par mail quand un GUEST crée une demande", async () => {
    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439022",
      role: "GUEST",
      invitedBy: "507f1f77bcf86cd799439011",
      prenom: "Marie",
      nom: "Curie",
    })

    ;(changeRequests.insertOne as any).mockResolvedValue({
      insertedId: "cr2",
    })

    findOneMock.mockResolvedValueOnce({
      _id: "507f1f77bcf86cd799439011",
      email: "owner@example.com",
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

    expect(sendModerationNotificationMock).toHaveBeenCalledTimes(1)
    expect(sendModerationNotificationMock).toHaveBeenCalledWith(
      "owner@example.com",
      expect.stringContaining("Marie Curie"),
      expect.any(String)
    )
  })

  it("ne bloque pas la création si l'envoi du mail échoue", async () => {
    ;(verifyToken as any).mockReturnValue({
      userId: "507f1f77bcf86cd799439022",
      role: "GUEST",
      invitedBy: "507f1f77bcf86cd799439011",
      prenom: "Marie",
      nom: "Curie",
    })

    ;(changeRequests.insertOne as any).mockResolvedValue({
      insertedId: "cr3",
    })

    findOneMock.mockResolvedValueOnce({
      _id: "507f1f77bcf86cd799439011",
      email: "owner@example.com",
    })

    sendModerationNotificationMock.mockRejectedValueOnce(new Error("SMTP down"))

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        type: "CREATE_PERSON",
        proposedData: { prenom: "Jean" },
      }),
    })

    const response = await POST({
      request,
      cookies: {
        get: () => ({ value: "token123" }),
      },
    } as any)

    const data = await response.json()

    // la création réussit quand même malgré l'échec du mail
    expect(response.status).toBe(201)
    expect(data.ok).toBe(true)
  })
})