import { LoginPageState } from "client/pages/Login";

export default function registerFormSubmission(
  setValues: (_: LoginPageState) => void
) {
  return (values: LoginPageState): Boolean => {
    if (values.email.indexOf("@") < 0 || values.email.indexOf(".") < 0) {
      setValues({ ...values, error: "Invalid email address." });
      return false;
    }
    setValues({ ...values, error: "" });
    return true;
  };
}
