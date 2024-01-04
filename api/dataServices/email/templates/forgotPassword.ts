import { UserEntity } from "../../user/types.js";

export const forgotPasswordTemplate = ({
  link,
}: {
  user: UserEntity;
  link: string;
}) => {
  return {
    subject: "w8mngr | Forgot password",
    body: `Reset your password: <a href="${link}">${link}</a>`,
  };
};
