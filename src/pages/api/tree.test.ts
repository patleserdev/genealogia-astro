// src/pages/api/tree.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import { GET } from "./tree";
import { persons, relations } from "../../lib/mongo";

vi.mock("../../lib/mongo", () => ({
  persons: {
    find: vi.fn(),
  },
  relations: {
    find: vi.fn(),
  },
}));

describe("GET /api/tree", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne un arbre généalogique", async () => {

    const grandParentId = new ObjectId();
    const parentId = new ObjectId();
    const childId = new ObjectId();

    const mockPersons = [
      {
        _id: grandParentId,
        prenom: "Jean",
      },
      {
        _id: parentId,
        prenom: "Paul",
      },
      {
        _id: childId,
        prenom: "Lucas",
      },
    ];

    const mockRelations = [
      {
        type: "PARENT",
        from: grandParentId,
        to: parentId,
      },
      {
        type: "PARENT",
        from: parentId,
        to: childId,
      },
    ];

    vi.mocked(persons.find).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockPersons),
    } as any);

    vi.mocked(relations.find).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockRelations),
    } as any);

    const requestUrl =
      `http://localhost:4321/api/tree?id=${grandParentId}`;

    const response = await GET({
      url: new URL(requestUrl),
    } as any);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveLength(3);

    // niveau 0
    expect(data[0][0].prenom).toBe("Jean");

    // niveau 1
    expect(data[1][0].prenom).toBe("Paul");

    // niveau 2
    expect(data[2][0].prenom).toBe("Lucas");

  });

});