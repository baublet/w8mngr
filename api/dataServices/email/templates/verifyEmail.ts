import { UserEntity } from "../../";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:8080";

export const verifyEmailTemplate = ({
  user,
  emailVerificationToken,
}: {
  user: UserEntity;
  emailVerificationToken: string;
}) => {
  const link = `${PUBLIC_URL}/?verifyEmailToken=${emailVerificationToken}`;
  return {
    subject: "w8mngr | Verify Email",
    body: `Verify your email: <a href="${link}">${link}</a>`,
  };
};
