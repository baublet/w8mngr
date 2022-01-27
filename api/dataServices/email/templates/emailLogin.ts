import { config } from "../../../config"
import { UserEntity } from "../../";

export const emailLoginTemplate = ({
  user,
  loginToken,
}: {
  user: UserEntity;
  loginToken: string;
}) => {
  const link = `${config.get("PUBLIC_URL")}/?loginToken=${loginToken}`;
  return {
    subject: "w8mngr | Your Email Login Token",
    body: `Login to w8mngr: <a href="${link}">${link}</a>`,
  };
};
