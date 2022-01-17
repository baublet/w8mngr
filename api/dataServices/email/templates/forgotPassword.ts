import { UserEntity } from "../../";

export const forgotPasswordTemplate = ({
  user,
  resetToken,
}: {
  user: UserEntity;
  resetToken: string;
}) => {
  return {
    subject: "w8mngr | Forgot Password",
    body: `Your password reset token is: ${resetToken}`,
  };
};
