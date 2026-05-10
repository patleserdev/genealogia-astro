// src/pages/api/auth/logout.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./logout";

describe("/api/auth/logout", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supprime le cookie et redirige vers /login", async () => {

    const deleteMock = vi.fn();

    const response = await GET({
      cookies: {
        delete: deleteMock,
      },
    } as any);

    // ✔ redirection
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/login");

    // ✔ cookie supprimé
    expect(deleteMock).toHaveBeenCalledWith("token", {
      path: "/",
    });
  });

});