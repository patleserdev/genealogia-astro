// src/pages/api/me.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";

import { GET } from "./me";
import { db } from "../../lib/mongo";
import { verifyToken } from "../../lib/auth";

vi.mock("../../lib/mongo", () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock("../../lib/auth", () => ({
  verifyToken: vi.fn(),
}));

describe("/api/me GET", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuse sans token", async () => {

    const response = await GET({
      cookies: {
        get: vi.fn().mockReturnValue(undefined),
      },
    } as any);

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.error).toBe("Non authentifié");

  });

  it("refuse un token invalide", async () => {

    vi.mocked(verifyToken).mockImplementation(() => {
      throw new Error("invalid");
    });

    const response = await GET({
      cookies: {
        get: vi.fn().mockReturnValue({
          value: "bad-token",
        }),
      },
    } as any);

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.error).toBe("Token invalide");

  });

  it("retourne 404 si utilisateur introuvable", async () => {

    vi.mocked(verifyToken).mockReturnValue({
      userId: new ObjectId().toString(),
      email: "john@test.com",
      prenom: "John",
      nom: "Doe",
       role:"GUEST"
    });

    const findOne = vi.fn().mockResolvedValue(null);

    vi.mocked(db.collection).mockReturnValue({
      findOne,
    } as any);

    const response = await GET({
      cookies: {
        get: vi.fn().mockReturnValue({
          value: "valid-token",
        }),
      },
    } as any);

    expect(response.status).toBe(404);

    const data = await response.json();

    expect(data.error).toBe("Utilisateur introuvable");

  });

  it("retourne user + person", async () => {

    const userId = new ObjectId();
    const personId = new ObjectId();

    vi.mocked(verifyToken).mockReturnValue({
      userId: userId.toString(),
      email: "john@test.com",
      prenom: "John",
      nom: "Doe",
       role:"GUEST"
    });

    const user = {
      _id: userId,
      email: "john@test.com",
      prenom: "John",
      nom: "Doe",
      personId,
    };

    const person = {
      _id: personId,
      prenom: "Jean",
      nom: "Dupont",
    };

    const findOne = vi
      .fn()
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(person);

    vi.mocked(db.collection).mockImplementation((name: string) => ({
      findOne,
    }) as any);

    const response = await GET({
      cookies: {
        get: vi.fn().mockReturnValue({
          value: "valid-token",
        }),
      },
    } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.user.email).toBe("john@test.com");

    expect(data.person.prenom).toBe("Jean");

  });

  it("retourne user sans person", async () => {

    const userId = new ObjectId();

    vi.mocked(verifyToken).mockReturnValue({
      userId: userId.toString(),
      email: "john@test.com",
      prenom: "John",
      nom: "Doe",
      role:"GUEST"
    });

    const user = {
      _id: userId,
      email: "john@test.com",
      prenom: "John",
      nom: "Doe",
      role:"GUEST"
    };

    const findOne = vi
      .fn()
      .mockResolvedValueOnce(user);

    vi.mocked(db.collection).mockImplementation(() => ({
      findOne,
    }) as any);

    const response = await GET({
      cookies: {
        get: vi.fn().mockReturnValue({
          value: "valid-token",
        }),
      },
    } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.user.email).toBe("john@test.com");

    expect(data.person).toBeNull();

  });

});