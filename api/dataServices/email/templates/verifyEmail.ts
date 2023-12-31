import { config } from "../../../config/config.js";
import { UserEntity } from "../../user/types.js";

export const verifyEmailTemplate = ({
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
