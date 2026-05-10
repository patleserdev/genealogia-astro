import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./register";
import bcrypt from "bcryptjs";
import { db } from "../../../lib/mongo";

vi.mock("../../../lib/mongo", () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
  },
}));

describe("/api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée un utilisateur avec succès (sans personId)", async () => {
    const insertOneUser = vi.fn();
    const insertOnePerson = vi.fn().mockResolvedValue({
      insertedId: "person123",
    });

    const findOneUser = vi.fn().mockResolvedValue(null);

    (db.collection as any).mockImplementation((name: string) => {
      if (name === "users") {
        return {
          findOne: findOneUser,
          insertOne: insertOneUser,
        };
      }

      if (name === "persons") {
        return {
          insertOne: insertOnePerson,
        };
      }
    });

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        prenom: "Jean",
        nom: "Dupont",
        email: "jean@test.com",
        password: "Password1!",
        dateNaissance: "1990-01-01",
      }),
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.ok).toBe(true);

    expect(insertOnePerson).toHaveBeenCalled();
    expect(insertOneUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "jean@test.com",
        prenom: "Jean",
        nom: "Dupont",
        password: "hashed_password",
      })
    );
  });

  it("refuse un email déjà utilisé", async () => {
    const findOneUser = vi.fn().mockResolvedValue({
      _id: "existing",
      email: "test@test.com",
    });

    (db.collection as any).mockImplementation((name: string) => {
      if (name === "users") {
        return {
          findOne: findOneUser,
        };
      }

      if (name === "persons") {
        return {
          insertOne: vi.fn(),
        };
      }
    });

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        prenom: "Jean",
        nom: "Dupont",
        email: "test@test.com",
        password: "Password1!",
      }),
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email déjà utilisé");
  });
});