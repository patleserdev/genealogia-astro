import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";

const {
  findMock,
  toArrayMock,
  insertOneMock,
  insertManyMock,
  verifyTokenMock,
} = vi.hoisted(() => ({
  findMock: vi.fn(),
  toArrayMock: vi.fn(),
  insertOneMock: vi.fn(),
  insertManyMock: vi.fn(),
  verifyTokenMock: vi.fn(),
}));

vi.mock("../../lib/auth", () => ({
  verifyToken: (...args: any[]) => verifyTokenMock(...args),
}));

vi.mock("../../lib/mongo", () => ({
  persons: {
    find: (...args: any[]) => findMock(...args),
    insertOne: insertOneMock,
  },

  user_persons: {
    find: (...args: any[]) => findMock(...args),
    insertMany: insertManyMock,
  },

  users: {
    find: (...args: any[]) => findMock(...args),
  },

  db: {},
}));

import { GET, POST } from "./persons";

describe("/api/persons GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 401 sans token", async () => {
    const response = await GET({
      cookies: {
        get: () => undefined,
      },
    } as any);

    expect(response.status).toBe(401);
  });

  it("retourne les personnes actives autorisées", async () => {
    const userId = new ObjectId();

    verifyTokenMock.mockReturnValue({
      userId: userId.toString(),
    });

    const links = [
      { personId: new ObjectId() },
      { personId: new ObjectId() },
    ];

    const personsData = [
      {
        _id: links[0].personId,
        prenom: "john",
        active: true,
      },
      {
        _id: links[1].personId,
        prenom: "jane",
        active: true,
      },
    ];

    findMock
      .mockReturnValueOnce({
        toArray: toArrayMock.mockResolvedValueOnce(links),
      })
      .mockReturnValueOnce({
        toArray: toArrayMock.mockResolvedValueOnce(personsData),
      });

    const response = await GET({
      cookies: {
        get: () => ({
          value: "valid-token",
        }),
      },
    } as any);

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
  });

  it("retourne une liste vide si aucun accès", async () => {
    verifyTokenMock.mockReturnValue({
      userId: new ObjectId().toString(),
    });

    findMock
      .mockReturnValueOnce({
        toArray: toArrayMock.mockResolvedValueOnce([]),
      })
      .mockReturnValueOnce({
        toArray: toArrayMock.mockResolvedValueOnce([]),
      });

    const response = await GET({
      cookies: {
        get: () => ({
          value: "valid-token",
        }),
      },
    } as any);

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe("/api/persons POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 401 sans token", async () => {
    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST({
      request,
      cookies: {
        get: () => undefined,
      },
    } as any);

    expect(response.status).toBe(401);
  });

  it("retourne 401 si token invalide", async () => {
    verifyTokenMock.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST({
      request,
      cookies: {
        get: () => ({
          value: "invalid-token",
        }),
      },
    } as any);

    expect(response.status).toBe(401);
  });

  it("retourne 403 pour un GUEST", async () => {
    verifyTokenMock.mockReturnValue({
      userId: new ObjectId().toString(),
      role: "GUEST",
    });

    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({
        prenom: "John",
        nom: "Doe",
      }),
    });

    const response = await POST({
      request,
      cookies: {
        get: () => ({
          value: "guest-token",
        }),
      },
    } as any);

    expect(response.status).toBe(403);
  });

  it("crée une personne et normalise les données", async () => {
    const ownerId = new ObjectId();
    const insertedId = new ObjectId();

    verifyTokenMock.mockReturnValue({
      userId: ownerId.toString(),
      role: "OWNER",
    });

    insertOneMock.mockResolvedValue({
      insertedId,
    });

    findMock.mockReturnValue({
      project: () => ({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });

    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({
        prenom: "  JOHN ",
        nom: " DOE ",
        email: " TEST@MAIL.COM ",
      }),
    });

    const response = await POST({
      request,
      cookies: {
        get: () => ({
          value: "owner-token",
        }),
      },
    } as any);

    const data = await response.json();

    expect(response.status).toBe(201);

    expect(insertOneMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prenom: "john",
        nom: "doe",
        email: "test@mail.com",
      })
    );

    expect(data.prenom).toBe("john");
  });

  it("crée les accès owner dans user_persons", async () => {
    const ownerId = new ObjectId();
    const insertedId = new ObjectId();

    verifyTokenMock.mockReturnValue({
      userId: ownerId.toString(),
      role: "OWNER",
    });

    insertOneMock.mockResolvedValue({
      insertedId,
    });

    findMock.mockReturnValue({
      project: () => ({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });

    const request = new Request("http://localhost/api/persons", {
      method: "POST",
      body: JSON.stringify({
        prenom: "John",
        nom: "Doe",
      }),
    });

    await POST({
      request,
      cookies: {
        get: () => ({
          value: "owner-token",
        }),
      },
    } as any);

    expect(insertManyMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          userId: ownerId,
          personId: insertedId,
          role: "owner",
        }),
      ])
    );
  });
});