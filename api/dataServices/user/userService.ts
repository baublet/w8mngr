import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";

export const userService = () => {
  return {
    create,
    findOneOrFail,
  };
};
