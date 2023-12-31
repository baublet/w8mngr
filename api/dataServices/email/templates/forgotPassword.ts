import { config } from "../../../config/config.js";
import { UserEntity } from "../../user/types.js";

export const forgotPasswordTemplate = ({
  resetToken,
}: {
  user: UserEntity;
  resetToken: string;
}) => {
  const link = `${config.get("PUBLIC_URL")}/reset-password/${resetToken}`;
  return {
    subject: "w8mngr | Forgot Password",
    body: `Reset your password: <a href="${link}">${link}</a>`,
  };
};
