import { config } from "../../../config";
import { UserEntity } from "../../";

export const verifyEmailTemplate = ({
  user,
  emailVerificationToken,
}: {
  user: UserEntity;
  emailVerificationToken: string;
}) => {
  const link = `${config.get(
    "PUBLIC_URL"
  )}/?verifyEmailToken=${emailVerificationToken}`;
  return {
    subject: "w8mngr | Verify Email",
    body: `Verify your email: <a href="${link}">${link}</a>`,
  };
};
