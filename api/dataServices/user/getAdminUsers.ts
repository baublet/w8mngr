import { Context } from "../../createContext";
import { dbService } from "../../config/db";
import { UserEntity } from "./types";

export async function getAdminUsers(context: Context): Promise<UserEntity[]> {
  return context.services
    .get(dbService)("W8MNGR_1")
    .selectFrom("user")
    .selectAll()
    .where("role", "=", "admin")
    .execute();
}
