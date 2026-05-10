// src/pages/api/relations.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";

import {
  GET,
  POST,
  deleteRelation,
} from "./relations";

import { relations, db } from "../../lib/mongo";

vi.mock("../../lib/mongo", () => ({
  relations: {
    find: vi.fn(),
    insertOne: vi.fn(),
  },
  db: {
    collection: vi.fn(),
  },
}));

describe("/api/relations", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------
  // GET
  // -----------------------------

  it("GET retourne les relations", async () => {

    const mockRelations = [
      {
        _id: new ObjectId(),
        type: "PARENT",
      },
    ];

    vi.mocked(relations.find).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockRelations),
    } as any);

    const response = await GET({} as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data[0]._id).toBe(
        mockRelations[0]._id.toString()
      );
      
      expect(data[0].type).toBe("PARENT");

  });

  // -----------------------------
  // POST
  // -----------------------------

  it("POST crée une relation", async () => {

    vi.mocked(relations.insertOne).mockResolvedValue({
      insertedId: new ObjectId(),
    } as any);

    const body = {
      from: new ObjectId().toString(),
      to: new ObjectId().toString(),
      type: "CONJOINT",
      status: "ACTIVE",
    };

    const request = new Request(
      "http://localhost/api/relations",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await POST({
      request,
    } as any);

    expect(response.status).toBe(201);

    const data = await response.json();

    expect(data.type).toBe("CONJOINT");
    expect(data.status).toBe("ACTIVE");

  });

  it("POST refuse une relation avec soi-même", async () => {

    const sameId = new ObjectId().toString();

    const request = new Request(
      "http://localhost/api/relations",
      {
        method: "POST",
        body: JSON.stringify({
          from: sameId,
          to: sameId,
          type: "CONJOINT",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await POST({
      request,
    } as any);

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data.error).toContain("elle-même");

  });

  // -----------------------------
  // deleteRelation
  // -----------------------------

  it("deleteRelation supprime une relation", async () => {

    const deleteOne = vi.fn().mockResolvedValue({
      deletedCount: 1,
    });

    vi.mocked(db.collection).mockReturnValue({
      deleteOne,
    } as any);

    await expect(
      deleteRelation(
        new ObjectId().toString()
      )
    ).resolves.toBe(true);

  });

  it("deleteRelation refuse un id invalide", async () => {

    await expect(
      deleteRelation("abc")
    ).rejects.toThrow("INVALID_ID");

  });

  it("deleteRelation retourne NOT_FOUND", async () => {

    const deleteOne = vi.fn().mockResolvedValue({
      deletedCount: 0,
    });

    vi.mocked(db.collection).mockReturnValue({
      deleteOne,
    } as any);

    await expect(
      deleteRelation(
        new ObjectId().toString()
      )
    ).rejects.toThrow("NOT_FOUND");

  });

});