import { UserType } from "../user/types";

export type ResolverType = (
  parent: Object,
  args: Object,
  context: Object,
  info: Object
) => Promise<any>;

export interface AuthType {
  user: UserType;
  token: string;
}

export interface RequestError {
  status: Number;
  message: string;
}
