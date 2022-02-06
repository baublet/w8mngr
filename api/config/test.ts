import { resolve } from "path";

import { ServiceContainer } from "@baublet/service-container";

import { Context, createContext } from "../createContext";
import { config } from "./config";

const testGlobalContext = createContext();
const testGlobalServiceContainer: ServiceContainer = testGlobalContext.services;

export function getTestGlobalContext(): Context {
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
  return testGlobalServiceContainer;
}

export async function testSetup() {
  const db = await import("./db");
  const databaseService = await getTestGlobalContext().services.get(
    db.dbService
  );
  const connection = await databaseService.getConnection();
  await connection.migrate.latest({
    directory: resolve(process.cwd(), "migrations"),
  });
}

export async function testCleanup() {
  const db = await import("./db");
  const databaseService = await getTestGlobalContext().services.get(
    db.dbService
  );
  await databaseService.destroy();
  getTestGlobalContext().services.delete(db.dbService);
}

export async function getTestGlobalDatabaseConnection() {
  const db = await import("./db");
  const service = await getTestGlobalServiceContainer().get(db.dbService);
  const connection = await service.getConnection();
  await connection.migrate.latest();
  return connection;
}
