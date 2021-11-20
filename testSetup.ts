import { dbService, getTestGlobalServiceContainer } from "./api/config/db";

export default async () => {
  const globalServices = getTestGlobalServiceContainer();
  const databaseService = await globalServices.get(dbService);
  const databaseConnection = await databaseService.getConnection();
  await databaseConnection.migrate.latest();
};
