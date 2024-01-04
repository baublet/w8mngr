import { UserEntity } from "../../user/types.js";

export const emailLoginTemplate = ({
  link,
}: {
  user: UserEntity;
  link: string;
}) => {
  return {
    subject: "w8mngr | Your email login link",
    body: `Login to w8mngr: <a href="${link}">${link}</a>`,
  };
};
