import { useReducer } from "react";

const initialInputState = { value: '', isTouched: false, }

const inputStatreReducer = (state, action) => {

  if (action.type === 'CHANGE_VALUE') {
    return {
      value: action.value,
      isTouched: state.isTouched
    }
  }
  if (action.type === 'BLUR') {
    return {
      value: state.value,
      isTouched: true
    }
  }
  if (action.type === 'RESET') {
    return {
      value: '',
      isTouched: false
    }
  }
  return initialInputState
};

const useInputWithReducer = (validateValue) => {
  const [inputState, dispatch] = useReducer(inputStatreReducer, initialInputState);

  const valueIsValid = validateValue(inputState.value); // ok car on utilise des states donc réévaluée à chaque modification du state enteredName
  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (ev) => {
    dispatch({ type: 'CHANGE_VALUE', value: ev.target.value });
  };

  const inputBlurHandler = (ev) => {
    dispatch({ type: 'BLUR' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  }

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset
  }
}

export default useInputWithReducer;
