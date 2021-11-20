import { dbService, getTestGlobalServiceContainer } from "./api/config/db";

export default async () => {
  const globalServices = getTestGlobalServiceContainer();
  const databaseService = await globalServices.get(dbService);
  await databaseService.closeConnection();
};
