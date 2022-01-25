import { UserEntity } from "../../";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:8080";

export const forgotPasswordTemplate = ({
  user,
  resetToken,
}: {
  user: UserEntity;
  resetToken: string;
}) => {
  const link = `${PUBLIC_URL}/reset-password/${resetToken}`;
  return {
    subject: "w8mngr | Forgot Password",
    body: `Reset your password: <a href="${link}">${link}</a>`,
  };
};
