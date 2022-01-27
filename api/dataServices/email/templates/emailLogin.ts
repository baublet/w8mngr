import { UserEntity } from "../../";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:8080";

export const emailLoginTemplate = ({
  user,
  loginToken,
}: {
  user: UserEntity;
  loginToken: string;
}) => {
  const link = `${PUBLIC_URL}/?loginToken=${loginToken}`;
  return {
    subject: "w8mngr | Your Email Login Token",
    body: `Login to w8mngr: <a href="${link}">${link}</a>`,
  };
};
