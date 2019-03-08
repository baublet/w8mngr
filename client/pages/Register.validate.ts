import { RegisterPageState } from "client/pages/Register";

export default function registerFormSubmission(
  setValues: (arg0: RegisterPageState) => void
) {
  return (values: RegisterPageState): Boolean => {
    if (values.email.indexOf("@") < 0 || values.email.indexOf(".") < 0) {
      setValues({ ...values, error: "Invalid email address." });
      return false;
    }
    if (values.password != values.confirm) {
      setValues({ ...values, error: "Passwords must match." });
      return false;
    }
    if (values.password.length < 8) {
      setValues({
        ...values,
        error: "Passwords must be at least 8 characters long."
      });
      return false;
    }
    setValues({ ...values, error: "" });
    return true;
  };
}
