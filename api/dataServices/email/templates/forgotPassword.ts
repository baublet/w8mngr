import { config } from "../../../config";
import { UserEntity } from "../../";

export const forgotPasswordTemplate = ({
  user,
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
