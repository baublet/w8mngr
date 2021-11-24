import { QueryBuilder } from "../../config";
import { validateArguments } from "./validateArguments";
import { isBefore } from "./isBefore";

export type Connection<TEntity, TNode = TEntity> = Resolvable<{
  pageInfo: {
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  edges: {
    cursor: string;
    entity: TEntity;
    node: TNode;
  }[];
  _resultsQueryText: string;
}>;

export type Cursor = {
  id: string;
  cursorData: Record<string, ["asc" | "desc", any]>;
};

function flipDirection(dir: "asc" | "desc"): "asc" | "desc" {
  if (dir === "asc") return "desc";
  return "asc";
}

function defaultEntityTransformer(entity: any) {
  return entity;
}

export async function buildConnectionResolver<TEntity, TNode = TEntity>(
  query: QueryBuilder,
  args: {
    before?: string | null;
    last?: number | null;
    first?: number | null;
    after?: string | null;
    sort?: Record<string | keyof TEntity, "asc" | "desc">;
    idProp?: string;
  },
  nodeTransformer: (
    entity: TEntity
  ) => Promise<TNode> = defaultEntityTransformer
): Promise<Connection<TEntity, TNode>> {
  validateArguments(args);

  const {
    first,
    after,
    before,
    last,
    sort = { id: "asc" } as Record<string | keyof TEntity, "asc" | "desc">,
    idProp = "id",
  } = args;
  const isBeforeQuery = isBefore(args);
  const totalCountQuery = query.clone().clearSelect().count("id AS count");
  const resultSetQuery = query.clone();
  const firstResultQuery = query.clone().clearSelect().select(idProp).limit(1);
  const lastResultQuery = query.clone().clearSelect().select(idProp).limit(1);

  let cursor: Cursor | undefined;

  if (isBeforeQuery && before) {
    cursor = deserializeCursor(before);
  }

  if (!isBeforeQuery && after) {
    cursor = deserializeCursor(after);
  }

  if (cursor) {
    for (const [column, [sortDirection, value]] of Object.entries(
      cursor.cursorData
    )) {
      if (isBeforeQuery) {
        resultSetQuery.where(
          column,
          sortDirection === "desc" ? ">" : "<",
          value
        );
      } else {
        resultSetQuery.where(
          column,
          sortDirection === "desc" ? "<" : ">",
          value
        );
      }
    }
  }

  for (const [key, direction] of Object.entries(sort)) {
    if (isBeforeQuery) {
      resultSetQuery.orderBy(key, flipDirection(direction));
      firstResultQuery.orderBy(key, flipDirection(direction));
      lastResultQuery.orderBy(key, direction);
    } else {
      resultSetQuery.orderBy(key, direction);
      firstResultQuery.orderBy(key, direction);
      lastResultQuery.orderBy(key, flipDirection(direction));
    }
  }

  if (isBeforeQuery && last) {
    resultSetQuery.limit(last);
  }
  if (!isBeforeQuery && first) {
    resultSetQuery.limit(first);
  }

  let totalCount: Promise<number>;
  const totalCountFn = () => {
    if (!totalCount) {
      totalCount = new Promise<number>(async (resolve) => {
        const count = await totalCountQuery;
        resolve(count[0].count);
      });
    }
    return totalCount;
  };

  let edges: Promise<
    {
      cursor: string;
      entity: TEntity;
      node: TNode;
    }[]
  >;

  const edgesFn = () => {
    if (!edges) {
      edges = new Promise<
        {
          cursor: string;
          entity: TEntity;
          node: TNode;
        }[]
      >(async (resolve) => {
        const edges: {
          cursor: string;
          entity: TEntity;
          node: TNode;
        }[] = [];

        const results = await resultSetQuery;
        for (const result of results) {
          const edge = {
            cursor: serializeCursor(result, idProp, sort),
            entity: result,
            node: await nodeTransformer(result),
          };
          if (isBeforeQuery) {
            edges.unshift(edge);
          } else {
            edges.push(edge);
          }
        }

        resolve(edges);
      });
    }
    return edges;
  };

  let hasNextPage: Promise<boolean>;
  const hasNextPageFn = () => {
    if (!hasNextPage) {
      hasNextPage = new Promise<boolean>(async (resolve) => {
        const resolvedEdges = await edgesFn();

        const lastSubsetResultEdge: undefined | { node: Record<string, any> } =
          resolvedEdges[resolvedEdges.length - 1];
        const lastSubsetResult: undefined | Record<string, any> =
          lastSubsetResultEdge?.node;

        if (!lastSubsetResult) {
          return resolve(false);
        }

        // Get the last ID of the full result set and compare it to the first
        // result of subset. If they don't match, there's more before this!
        const lastResults = isBeforeQuery
          ? await firstResultQuery
          : await lastResultQuery;
        const lastResult = lastResults[0];

        if (!lastResult) {
          return resolve(false);
        }

        const hasNextPage = lastResult[idProp] !== lastSubsetResult[idProp];

        resolve(hasNextPage);
      });
    }
    return hasNextPage;
  };

  let hasPreviousPage: Promise<boolean>;
  const hasPreviousPageFn = () => {
    if (!hasPreviousPage) {
      hasPreviousPage = new Promise<boolean>(async (resolve) => {
        const resolvedEdges = await edgesFn();

        const firstSubsetResultEdge: undefined | { node: Record<string, any> } =
          resolvedEdges[0];
        const firstSubsetResult: undefined | Record<string, any> =
          firstSubsetResultEdge?.node;

        if (!firstSubsetResult) {
          return resolve(false);
        }

        // Get the first ID of the full result set and compare it to the first
        // result of subset. If they don't match, there's more before this!
        const firstResults = isBeforeQuery
          ? await lastResultQuery
          : await firstResultQuery;
        const firstResult = firstResults[0];

        if (!firstResult) {
          return resolve(false);
        }

        const hasPreviousPage =
          firstResult[idProp] !== firstSubsetResult[idProp];
        resolve(hasPreviousPage);
      });
    }
    return hasPreviousPage;
  };

  return {
    pageInfo: {
      totalCount: totalCountFn,
      hasNextPage: hasNextPageFn,
      hasPreviousPage: hasPreviousPageFn,
    },
    edges: edgesFn,
    _resultsQueryText: resultSetQuery.toQuery(),
  };
}

function deserializeCursor(cursorString: string): Cursor {
  try {
    const cursorResults: Cursor = JSON.parse(
      Buffer.from(cursorString, "base64").toString("utf-8")
    );
    return cursorResults;
  } catch (e) {
    throw new InvalidCursorError(cursorString);
  }
}

function serializeCursor(
  entity: Record<string, any>,
  idProp: string,
  sortFields: Record<string, "asc" | "desc">
): string {
  const cursor: Cursor = { id: entity[idProp], cursorData: {} };
  for (const [column, direction] of Object.entries(sortFields)) {
    cursor.cursorData[column] = [direction, entity[column]];
  }
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

class InvalidCursorError extends Error {
  constructor(cursor: string, message?: string) {
    super(
      `Invalid cursor! Expect cursor to deserialize into an object. ${cursor}${
        message ?? `\n\n${message}`
      }`
    );
  }
}
