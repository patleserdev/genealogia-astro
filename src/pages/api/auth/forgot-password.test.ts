// src/pages/api/auth/forgot-password.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./forgot-password";
import { db } from "../../../lib/mongo";

vi.mock("../../../lib/mongo", () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock("crypto", () => ({
  default: {
    randomBytes: vi.fn(() => ({
      toString: () => "fake-token-123",
    })),
  },
}));

describe("/api/forgot-password", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------
  // 1. email manquant
  // -------------------------
  it("retourne 400 si email vide", async () => {

    const request = new Request(
      "http://localhost/api/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email: "" }),
      }
    );

    const response = await POST({ request } as any);

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data.error).toBe("Email requis");

  });

  // -------------------------
  // 2. user inexistant
  // -------------------------
  it("retourne ok même si user introuvable", async () => {

    const findOne = vi.fn().mockResolvedValue(null);

    vi.mocked(db.collection).mockReturnValue({
      findOne,
    } as any);

    const request = new Request(
      "http://localhost/api/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email: "test@mail.com" }),
      }
    );

    const response = await POST({ request } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.ok).toBe(true);

    expect(findOne).toHaveBeenCalledWith({
      email: "test@mail.com",
    });

  });

  // -------------------------
  // 3. user existant
  // -------------------------
  it("crée un token de reset si user existe", async () => {

    const user = {
      _id: "user-id-123",
      email: "test@mail.com",
    };

    const findOne = vi.fn().mockResolvedValue(user);
    const insertOne = vi.fn().mockResolvedValue({ insertedId: "reset-id" });

    vi.mocked(db.collection).mockImplementation((name: string) => {

      if (name === "users") {
        return { findOne } as any;
      }

      if (name === "password_resets") {
        return { insertOne } as any;
      }

      return {} as any;
    });

    const request = new Request(
      "http://localhost/api/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email: "test@mail.com" }),
      }
    );

    const response = await POST({ request } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.ok).toBe(true);

    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@mail.com",
        token: "fake-token-123",
        used: false,
      })
    );

  });

});