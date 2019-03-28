import { RegisterPageState } from "client/components/User/RegisterPage";
import { Dispatch } from "react";

export default function registrationValidation(
  setError: Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: Dispatch<React.SetStateAction<string>>
) {
  return (values: RegisterPageState): Boolean => {
    if (values.email.indexOf("@") < 0 || values.email.indexOf(".") < 0) {
      setError(true);
      setErrorMessage("Invalid email address.");
      return false;
    }
    if (values.password != values.confirm) {
      setError(true);
      setErrorMessage("Passwords must match.");
      return false;
    }
    if (values.password.length < 8) {
      setError(true);
      setErrorMessage("Passwords must be at least 8 characters long.");
      return false;
    }
    setError(false);
    return true;
  };
}
