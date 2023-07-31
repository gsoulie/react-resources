import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue); // ok car on utilise des states donc réévaluée à chaque modification du state enteredName
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (ev) => {
    setEnteredValue(ev.target.value);
  };

  const inputBlurHandler = (ev) => {
    setIsTouched(true);
  };

  const reset = () => {
    setIsTouched(false);
    setEnteredValue('');
  }

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset
  }
}

export default useInput;
