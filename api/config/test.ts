import { resolve } from "path";

import { ServiceContainer } from "@baublet/service-container";

import { Context, createContext } from "../createContext";
import { config } from "./config";
import { dbService } from "./db";

let testGlobalContext: Context | undefined;

export function getTestGlobalContext(): Context {
  testGlobalContext = testGlobalContext || createContext();
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

export async function testSetup() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  const connection = await databaseService.getConnection();
  await connection.migrate.latest({
    directory: resolve(process.cwd(), "migrations"),
  });
}

export async function testCleanup() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  await databaseService.destroy();
  getTestGlobalContext().services.delete(dbService);
}

export async function getTestGlobalDatabaseConnection() {
  const service = await getTestGlobalServiceContainer().get(dbService);
  const connection = await service.getConnection();
  await connection.migrate.latest();
  return connection;
}
