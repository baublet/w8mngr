import { getQueryProvider } from "../../config";
import { UserEntity } from "./index";

export const query = getQueryProvider<UserEntity>("user");
