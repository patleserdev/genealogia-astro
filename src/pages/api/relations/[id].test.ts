import { describe, it, expect, vi, beforeEach } from "vitest";

import { db } from "../../../lib/mongo";
import { deleteRelation } from "../relations.ts";

vi.mock("../../../lib/mongo", () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe("deleteRelation", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supprime une relation", async () => {

    const deleteOne = vi.fn().mockResolvedValue({
      deletedCount: 1,
    });

    vi.mocked(db.collection).mockReturnValue({
      deleteOne,
    } as any);

    await expect(
      deleteRelation("69c7e1baf0a1e849c080a69f")
    ).resolves.toBe(true);

  });

  it("rejette un id invalide", async () => {

    await expect(
      deleteRelation("abc")
    ).rejects.toThrow("INVALID_ID");

  });

  it("rejette si relation absente", async () => {

    const deleteOne = vi.fn().mockResolvedValue({
      deletedCount: 0,
    });

    vi.mocked(db.collection).mockReturnValue({
      deleteOne,
    } as any);

    await expect(
      deleteRelation("69c7e1baf0a1e849c080a69f")
    ).rejects.toThrow("NOT_FOUND");

  });

});