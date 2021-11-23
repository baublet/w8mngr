import { getTestConnection, destroyTestConnection } from "../db";
import { buildConnectionResolver } from "./buildConnectionResolver";

type User = {
  id: number;
  age: number;
  name: string;
};

beforeAll(async () => {
  const db = await getTestConnection();
  await db.schema.createTable("users", function (table) {
    table.increments("id");
    table.integer("age").notNullable();
    table.string("name", 255).notNullable();
  });

  function createUser(data: { age: number; name: string }) {
    return db.table("users").insert(data);
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
});

afterAll(destroyTestConnection);

it("doesn't blow up", async () => {
  const db = await getTestConnection();
  await expect(
    buildConnectionResolver(db.table("users"), {
      first: 10,
    })
  ).resolves.toEqual(expect.anything());
});

it("returns the total count", async () => {
  const db = await getTestConnection();
  const connection = await buildConnectionResolver(db.table("users"), {
    first: 10,
  });
  await expect(connection.pageInfo.totalCount()).resolves.toEqual(26);
  await expect(connection.pageInfo.totalCount()).resolves.not.toEqual(20);
});

it("type test", async () => {
  const db = await getTestConnection();
  const connection = await buildConnectionResolver<User>(db.table("users"), {
    first: 10,
  });

  const edges = await connection.edges();
  const nodes = edges.map((edge) => edge.node);

  // @ts-expect-error
  nodes[0].id = "fail";
  // @ts-expect-error
  nodes[0].name = 1;
});

describe("Basic sort by ID", () => {
  it("returns proper results: first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` order by `id` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6MSwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDFdfX0=",
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor: "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDJdfX0=",
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor: "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDNdfX0=",
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("resolves hasPreviousPage properly: has no previous page", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
    });
    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(false);
  });

  it("resolves hasPreviousPage properly: has a previous page", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
      after: "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDJdfX0=",
    });
    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(true);
  });

  it("resolves hasNextPage properly: has more results", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
    });
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });

  it("resolves hasNextPage properly: has no more results", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      last: 3,
    });
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
      after: "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDNdfX0=",
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` where `id` > 3 order by `id` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6NCwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDRdfX0=",
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor: "eyJpZCI6NSwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDVdfX0=",
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor: "eyJpZCI6NiwiY3Vyc29yRGF0YSI6eyJpZCI6WyJhc2MiLDZdfX0=",
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});

describe("Multiple field sort", () => {
  it("returns proper results: first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver<User>(db.table("users"), {
      first: 3,
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` order by `age` desc, `name` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6MSwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjZdLCJuYW1lIjpbImFzYyIsIkFteSJdfX0=",
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor:
          "eyJpZCI6MiwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjVdLCJuYW1lIjpbImFzYyIsIkJlbiJdfX0=",
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor:
          "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfX0=",
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
      after:
        "eyJpZCI6MywiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfX0=",
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` where `age` < 24 and `name` > 'Claire' order by `age` desc, `name` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6NCwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjNdLCJuYW1lIjpbImFzYyIsIkRhbmllbGxlIl19fQ==",
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor:
          "eyJpZCI6NSwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjJdLCJuYW1lIjpbImFzYyIsIkVhcmwiXX19",
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor:
          "eyJpZCI6NiwiY3Vyc29yRGF0YSI6eyJhZ2UiOlsiZGVzYyIsMjFdLCJuYW1lIjpbImFzYyIsIkZyYW5jaXMiXX19",
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});

describe("Before cursors", () => {
  it("returns proper results: last 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver<User>(db.table("users"), {
      last: 3,
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` order by `age` asc, `name` desc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6MjYsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDFdLCJuYW1lIjpbImFzYyIsIlplYnVsb24iXX19",
        node: { age: 1, id: 26, name: "Zebulon" },
      },
      {
        cursor:
          "eyJpZCI6MjUsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDJdLCJuYW1lIjpbImFzYyIsIll2b25uZSJdfX0=",
        node: { age: 2, id: 25, name: "Yvonne" },
      },
      {
        cursor:
          "eyJpZCI6MjQsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDNdLCJuYW1lIjpbImFzYyIsIlhhbmRlciJdfX0=",
        node: { age: 3, id: 24, name: "Xander" },
      },
    ]);

    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(false);
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });

  it("returns proper results: last 3 after the above last 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      last: 3,
      before:
        "eyJpZCI6MjQsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDNdLCJuYW1lIjpbImFzYyIsIlhhbmRlciJdfX0=",
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` where `age` > 3 and `name` < 'Xander' order by `age` asc, `name` desc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor:
          "eyJpZCI6MjMsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDRdLCJuYW1lIjpbImFzYyIsIldpbGxpYW0iXX19",
        node: { age: 4, id: 23, name: "William" },
      },
      {
        cursor:
          "eyJpZCI6MjIsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDVdLCJuYW1lIjpbImFzYyIsIlZpb2xldCJdfX0=",
        node: { age: 5, id: 22, name: "Violet" },
      },
      {
        cursor:
          "eyJpZCI6MjEsImN1cnNvckRhdGEiOnsiYWdlIjpbImRlc2MiLDZdLCJuYW1lIjpbImFzYyIsIlVscmljaCJdfX0=",
        node: { age: 6, id: 21, name: "Ulrich" },
      },
    ]);

    await expect(connection.pageInfo.hasPreviousPage()).resolves.toEqual(true);
    await expect(connection.pageInfo.hasNextPage()).resolves.toEqual(true);
  });
});
