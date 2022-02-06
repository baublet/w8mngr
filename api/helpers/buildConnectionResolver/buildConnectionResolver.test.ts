import { Knex } from "knex";
import { buildConnectionResolver } from "./buildConnectionResolver";
import { getConnection } from "../../config/db";
import { ulid } from "ulid";

type User = {
  id: number;
  age: number;
  name: string;
};

async function setup() {
  const db = await getConnection();
  const userTableName = ulid();

  await db.schema.createTable(userTableName, function (table) {
    table.increments("id");
    table.integer("age").notNullable();
    table.string("name", 255).notNullable();
  });

  function createUser(data: { age: number; name: string }) {
    return db.table(userTableName).insert(data);
  }

  const fixtures: [string, number][] = [
    ["Amy", 26],
    ["Ben", 25],
    ["Claire", 24],
    ["Danielle", 23],
    ["Earl", 22],
    ["Francis", 21],
    ["Gus", 20],
    ["Hillary", 19],
    ["Inez", 18],
    ["James", 17],
    ["Katy", 16],
    ["Lana", 15],
    ["Moana", 14],
    ["Nina", 13],
    ["Owen", 12],
    ["Penelope", 11],
    ["Quaid", 10],
    ["Ryan", 9],
    ["Sylvia", 8],
    ["Tanya", 7],
    ["Ulrich", 6],
    ["Violet", 5],
    ["William", 4],
    ["Xander", 3],
    ["Yvonne", 2],
    ["Zebulon", 1],
  ];

  for (const [name, age] of fixtures) {
    await createUser({ name, age });
  }

  return {
    userTableName,
    fixtures,
    db,
  };
}

let db: Knex<any, any>;
let userTableName: string;

beforeAll(async () => {
  const { db: dbSetup, userTableName: userTableNameSetup } = await setup();
  db = dbSetup;
  userTableName = userTableNameSetup;
});

it("doesn't blow up", async () => {
  await expect(
    buildConnectionResolver(db.table(userTableName), {
      first: 10,
    })
  ).resolves.toEqual(expect.anything());
});

it("returns the total count", async () => {
  const connection: any = await buildConnectionResolver(
    db.table(userTableName),
    {
      first: 10,
    }
  );
  await expect(connection.pageInfo.totalCount()).resolves.toEqual(26);
  await expect(connection.pageInfo.totalCount()).resolves.not.toEqual(20);
});

describe("Basic sort by ID", () => {
  it("returns proper results: first 3", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" order by \"id\" asc limit 3`
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6MSwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDFdfX0=",
        entity: expect.objectContaining({ id: 1 }),
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor: "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDJdfX0=",
        entity: expect.objectContaining({ id: 2 }),
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor: "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDNdfX0=",
        entity: expect.objectContaining({ id: 3 }),
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("resolves hasPreviousPage properly: has no previous page", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
      }
    );
    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(false);
  });

  it("resolves hasPreviousPage properly: has a previous page", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
        after: "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDJdfX0=",
      }
    );
    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(true);
  });

  it("resolves hasNextPage properly: has more results", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
      }
    );
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });

  it("resolves hasNextPage properly: has no more results", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        last: 3,
      }
    );
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(false);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
        after: "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDNdfX0=",
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" where \"id\" > 3 order by \"id\" asc limit 3`
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6NCwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDRdfX0=",
        entity: expect.objectContaining({ id: 4 }),
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor: "eyJpZCI6NSwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDVdfX0=",
        entity: expect.objectContaining({ id: 5 }),
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor: "eyJpZCI6NiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDZdfX0=",
        entity: expect.objectContaining({ id: 6 }),
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});

describe("Multiple field sort", () => {
  it("returns proper results: first 3", async () => {
    const connection: any = await buildConnectionResolver<User>(
      db.table(userTableName),
      {
        first: 3,
        sort: {
          age: "desc",
          name: "asc",
        },
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" order by \"age\" desc, \"name\" asc limit 3`
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6MSwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjZdLCJuYW1lIjpbImFzYyIsIkFteSJdfX0=",
        entity: expect.objectContaining({ id: 1 }),
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor:
          "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjVdLCJuYW1lIjpbImFzYyIsIkJlbiJdfX0=",
        entity: expect.objectContaining({ id: 2 }),
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor:
          "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfX0=",
        entity: expect.objectContaining({ id: 3 }),
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        first: 3,
        after:
          "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfX0=",
        sort: {
          age: "desc",
          name: "asc",
        },
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" where \"age\" < 24 and \"name\" > 'Claire' order by \"age\" desc, \"name\" asc limit 3`
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6NCwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjNdLCJuYW1lIjpbImFzYyIsIkRhbmllbGxlIl19fQ==",
        entity: expect.objectContaining({ id: 4 }),
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor:
          "eyJpZCI6NSwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjJdLCJuYW1lIjpbImFzYyIsIkVhcmwiXX19",
        entity: expect.objectContaining({ id: 5 }),
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor:
          "eyJpZCI6NiwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjFdLCJuYW1lIjpbImFzYyIsIkZyYW5jaXMiXX19",
        entity: expect.objectContaining({ id: 6 }),
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});

describe("Before cursors", () => {
  it("returns proper results: last 3", async () => {
    const connection: any = await buildConnectionResolver<User>(
      db.table(userTableName),
      {
        last: 3,
        sort: {
          age: "desc",
          name: "asc",
        },
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" order by \"age\" asc, \"name\" desc limit 3`
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: expect.any(String),
        entity: expect.objectContaining({ id: 24 }),
        node: { age: 3, id: 24, name: "Xander" },
      },
      {
        cursor: expect.any(String),
        entity: expect.objectContaining({ id: 25 }),
        node: { age: 2, id: 25, name: "Yvonne" },
      },
      {
        cursor: expect.any(String),
        entity: expect.objectContaining({ id: 26 }),
        node: { age: 1, id: 26, name: "Zebulon" },
      },
    ]);

    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(true);
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(false);
  });

  it("returns proper results: last 3 after the above last 3", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        last: 3,
        before: Buffer.from(
          JSON.stringify({
            id: 24,
            cursorData: { age: ["desc", 3], name: ["asc", "Xander"] },
          })
        ).toString("base64"),
        sort: {
          age: "desc",
          name: "asc",
        },
      }
    );

    expect(connection._resultsQueryText).toEqual(
      `select * from \"${userTableName}\" where \"age\" > 3 and \"name\" < 'Xander' order by \"age\" asc, \"name\" desc limit 3`
    );

    const edges = await connection.edges();

    expect(
      edges.map(
        (edge: any) =>
          edge.node.id + ". " + edge.node.name + " - " + edge.node.age
      )
    ).toEqual(["21. Ulrich - 6", "22. Violet - 5", "23. William - 4"]);

    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(true);
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });

  it("returns proper hasNext and hasPrev pages", async () => {
    const connection: any = await buildConnectionResolver(
      db.table(userTableName),
      {
        last: 3,
        before: Buffer.from(
          JSON.stringify({
            id: 2,
            cursorData: { age: ["desc", 25], name: ["asc", "Ben"] },
          })
        ).toString("base64"),
        sort: {
          age: "desc",
          name: "asc",
        },
      }
    );

    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(false);
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });
});
