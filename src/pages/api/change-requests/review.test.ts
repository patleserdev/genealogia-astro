import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./review"
import {
  changeRequests,
  persons,
  user_persons,
  notifications,
} from "../../../lib/mongo"
import { ObjectId } from "mongodb"
import { verifyToken } from "../../../lib/auth"

vi.mock("../../../lib/auth", () => ({
  verifyToken: vi.fn(),
}))

vi.mock("../../../lib/mongo", () => ({
  changeRequests: {
    findOne: vi.fn(),
    updateOne: vi.fn(),
  },
  persons: {
    insertOne: vi.fn(),
    updateOne: vi.fn(),
  },
  user_persons: {
    insertOne: vi.fn(),
  },
  notifications: {
    insertOne: vi.fn(),
  },
}))

describe("/api/change-requests/review", () => {
  const fakeOwnerId = new ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()

    ;(verifyToken as any).mockReturnValue({
      userId: fakeOwnerId.toString(),
      role: "OWNER",
    })
  })

  function createRequest(body: any) {
    return {
      request: new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(body),
      }),
      cookies: {
        get: () => ({ value: "token" }),
      },
    } as any
  }

  it("refuse si décision invalide", async () => {
    const res = await POST(
      createRequest({
        changeRequestId: new ObjectId().toString(),
        decision: "INVALID",
      })
    )

    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe("Décision invalide")
  })

  it("retourne 404 si demande introuvable", async () => {
    ;(changeRequests.findOne as any).mockResolvedValue(null)

    const res = await POST(
      createRequest({
        changeRequestId: new ObjectId().toString(),
        decision: "ACCEPTED",
      })
    )

    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe("Demande introuvable")
  })

  it("ACCEPTED + CREATE_PERSON → insert person + user_persons + notification + update request", async () => {
    const crId = new ObjectId()
    const newPersonId = new ObjectId()

    ;(changeRequests.findOne as any).mockResolvedValue({
      _id: crId,
      type: "CREATE_PERSON",
      proposedData: { prenom: "Jean" },
      ownerId: fakeOwnerId,
      requestedByUserId: new ObjectId(),
    })

    ;(persons.insertOne as any).mockResolvedValue({
      insertedId: newPersonId,
    })

    const res = await POST(
      createRequest({
        changeRequestId: crId.toString(),
        decision: "ACCEPTED",
      })
    )

    expect(res.status).toBe(200)

    expect(persons.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true,
        prenom: "Jean",
      })
    )

    expect(user_persons.insertOne).toHaveBeenCalledTimes(2)

    expect(notifications.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CHANGE_REQUEST",
        read: false,
      })
    )

    expect(changeRequests.updateOne).toHaveBeenCalledWith(
      { _id: crId },
      expect.objectContaining({
        $set: expect.objectContaining({
          status: "ACCEPTED",
        }),
      })
    )
  })

  it("ACCEPTED + UPDATE_PERSON → update person + notification", async () => {
    const crId = new ObjectId()
    const personId = new ObjectId()

    ;(changeRequests.findOne as any).mockResolvedValue({
      _id: crId,
      type: "UPDATE_PERSON",
      personId,
      proposedData: { prenom: "Paul" },
      ownerId: fakeOwnerId,
      requestedByUserId: new ObjectId(),
    })

    const res = await POST(
      createRequest({
        changeRequestId: crId.toString(),
        decision: "ACCEPTED",
      })
    )

    expect(res.status).toBe(200)

    expect(persons.updateOne).toHaveBeenCalledWith(
      { _id: personId },
      { $set: { prenom: "Paul" } }
    )

    expect(notifications.insertOne).toHaveBeenCalled()
  })

  it("REJECTED → update status + notification sans modification data", async () => {
    const crId = new ObjectId()

    ;(changeRequests.findOne as any).mockResolvedValue({
      _id: crId,
      type: "CREATE_PERSON",
      proposedData: {},
      ownerId: fakeOwnerId,
      requestedByUserId: new ObjectId(),
    })

    const res = await POST(
      createRequest({
        changeRequestId: crId.toString(),
        decision: "REJECTED",
        reviewNote: "nope",
      })
    )

    expect(res.status).toBe(200)

    expect(persons.insertOne).not.toHaveBeenCalled()
    expect(persons.updateOne).not.toHaveBeenCalled()

    expect(notifications.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CHANGE_REQUEST",
      })
    )

    expect(changeRequests.updateOne).toHaveBeenCalledWith(
      { _id: crId },
      expect.objectContaining({
        $set: expect.objectContaining({
          status: "REJECTED",
        }),
      })
    )
  })
})