import { History } from "history";
import register from "../helpers/register";
import login from "../helpers/login";
import { RegisterPageState } from "./Register";

export default function registerFormSubmission(
  setValues: (arg0: RegisterPageState) => void,
  history: History
) {
  return (values: RegisterPageState) => {
    if (values.email.indexOf("@") < 0 || values.email.indexOf(".") < 0) {
      return setValues({ ...values, error: "Invalid email address." });
    }
    if (values.password != values.confirm) {
      return setValues({ ...values, error: "Passwords must match." });
    }
    if (values.password.length < 8) {
      return setValues({
        ...values,
        error: "Passwords must be at least 8 characters long."
      });
    }
    setValues({ ...values, error: "" });
    register(values.email, values.password)
      .then(result => {
        if (result === true) {
          return login(values.email, values.password).then(result => {
            history.push("/");
          });
        }
        setValues({ ...values, error: result });
      })
      .catch(e => {
        setValues({ ...values, error: e });
      });
  };
}
