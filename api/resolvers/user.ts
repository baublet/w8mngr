import { UserType } from "../user/types";

const userResolver = (_, __, context): Promise<UserType | false> => {
  return context.user;
};

export default userResolver;
