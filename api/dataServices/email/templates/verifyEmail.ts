import { UserEntity } from "../../user/types.js";

export const verifyEmailTemplate = ({
  link,
}: {
  user: UserEntity;
  link: string;
}) => {
  return {
    subject: "w8mngr | Verify email",
    body: `Verify your email: <a href="${link}">${link}</a>`,
  };
};
