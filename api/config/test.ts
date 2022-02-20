import { resolve } from "path";

import { ServiceContainer } from "@baublet/service-container";
import { ulid } from "ulid";

import { Context, createContext } from "../createContext";
import { config } from "./config";
import { dbService } from "./db";

let testGlobalContext: Context | undefined;
const testSchemaName = ulid();
process.env["DATABASE_SCHEMA"] = testSchemaName;

export function getTestGlobalContext(): Context {
  testGlobalContext =
    testGlobalContext || createContext({ clientId: "test-context" });
  return testGlobalContext;
}

export function getTestGlobalServiceContainer(): ServiceContainer {
  if (config.get("NODE_ENV") !== "test") {
    throw new Error(
      `Invalid environment to use the global testing service container. Environment: ${config.get(
        "NODE_ENV"
      )}`
    );
  }
  return getTestGlobalContext().services;
}

export async function setupDatabase() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  databaseService.setSchema(testSchemaName);
  const connection = databaseService.getConnection();

  await connection.raw(`CREATE SCHEMA IF NOT EXISTS "${testSchemaName}"`);

  await connection.migrate.latest({
    directory: resolve(process.cwd(), "migrations"),
    schemaName: testSchemaName,
  });
}

export async function cleanupDatabase() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  const connection = databaseService.getConnection();

  await connection.raw(`DROP SCHEMA IF EXISTS "${testSchemaName}" CASCADE`);

  await databaseService.destroy();
  getTestGlobalContext().services.delete(dbService);
}

export function usesDatabase() {
  const anyBeforeAll: any = beforeAll;
  const anyAfterAll: any = afterAll;

  anyBeforeAll(setupDatabase);
  anyAfterAll(cleanupDatabase);
}

export async function getTestGlobalDatabaseConnection() {
  const service = await getTestGlobalServiceContainer().get(dbService);
  const connection = await service.getConnection();
  await connection.migrate.latest();
  return connection;
}
