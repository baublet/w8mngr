import { Context } from "../../createContext";
import { getQuery } from "./query";
import { UserEntity } from "./types";

export async function getAdminUsers(context: Context): Promise<UserEntity[]> {
  const query = (await getQuery(context))();
  return query.select("*").where("role", "=", "admin");
}
