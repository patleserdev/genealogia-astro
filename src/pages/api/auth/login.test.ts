// src/pages/api/auth/login.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./login";
import { db, loginLogs } from "../../../lib/mongo";
import { createToken } from "../../../lib/auth";
import bcrypt from "bcryptjs";

vi.mock("../../../lib/mongo", () => ({
  db: {
    collection: vi.fn(),
  },
  loginLogs: {
    insertOne: vi.fn(),
  },
}));

vi.mock("../../../lib/auth", () => ({
  createToken: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("/api/auth/login", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------
  // 1. email manquant
  // -------------------------
  it("retourne 400 si email manquant", async () => {

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "",
        password: "1234",
      }),
    });

    const response = await POST({
      request,
      cookies: { set: vi.fn() },
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data.error).toBe("Adresse mail manquante");

  });

  // -------------------------
  // 2. password manquant
  // -------------------------
  it("retourne 400 si password manquant", async () => {

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@mail.com",
        password: "",
      }),
    });

    const response = await POST({
      request,
      cookies: { set: vi.fn() },
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data.error).toBe("Mot de passe manquant");

  });

  // -------------------------
  // 3. user introuvable
  // -------------------------
  it("retourne 401 si user inexistant", async () => {

    const findOne = vi.fn().mockResolvedValue(null);

    vi.mocked(db.collection).mockReturnValue({
      findOne,
    } as any);

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@mail.com",
        password: "1234",
      }),
    });

    const response = await POST({
      request,
      cookies: { set: vi.fn() },
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.error).toBe("Identifiants incorrects");

  });

  // -------------------------
  // 4. mauvais password
  // -------------------------
  it("retourne 401 si password invalide", async () => {

    const user = {
      _id: { toString: () => "user-id" },
      email: "test@mail.com",
      password: "hashed",
    };

    const findOne = vi.fn().mockResolvedValue(user);

    vi.mocked(db.collection).mockReturnValue({
      findOne,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@mail.com",
        password: "wrong",
      }),
    });

    const response = await POST({
      request,
      cookies: { set: vi.fn() },
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(401);

  });

  // -------------------------
  // 5. login OK
  // -------------------------
  it("connecte l'utilisateur correctement", async () => {

    const user = {
      _id: { toString: () => "user-id" },
      email: "test@mail.com",
      nom: "Doe",
      prenom: "John",
      password: "hashed",
      role: "OWNER",
    };

    const findOne = vi.fn().mockResolvedValue(user);

    vi.mocked(db.collection).mockReturnValue({
      findOne,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

    vi.mocked(createToken).mockReturnValue("fake-token");

    const setCookie = vi.fn();

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "TEST@MAIL.COM",
        password: "1234",
      }),
    });

    const response = await POST({
      request,
      cookies: { set: setCookie },
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.ok).toBe(true);

    // cookie
    expect(setCookie).toHaveBeenCalledWith(
      "token",
      "fake-token",
      expect.objectContaining({
        httpOnly: true,
        path: "/",
      })
    );

    // token content
    expect(createToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-id",
        email: "test@mail.com",
        role: "OWNER",
      })
    );

    // log DB
    expect(loginLogs.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@mail.com",
        success: true,
        ip: "127.0.0.1",
      })
    );

  });

});