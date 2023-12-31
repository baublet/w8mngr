import { Context } from "../../createContext.js";
import { dbService } from "../../config/db.js";
import { UserEntity } from "./types.js";

export async function getAdminUsers(context: Context): Promise<UserEntity[]> {
  return context.services
    .get(dbService)("W8MNGR_1")
    .selectFrom("user")
    .selectAll()
    .where("role", "=", "admin")
    .execute();
}
