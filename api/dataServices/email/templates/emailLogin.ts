import { config } from "../../../config/config";
import { UserEntity } from "../../user/types";

export const emailLoginTemplate = ({
  loginToken,
}: {
  user: UserEntity;
  loginToken: string;
}) => {
  const link = `${config.get(
    "PUBLIC_URL"
  )}/logging-in?loginToken=${loginToken}`;
  return {
    subject: "w8mngr | Your Email Login Token",
    body: `Login to w8mngr: <a href="${link}">${link}</a>`,
  };
};
