import useInput from "../hooks/use-input";

export const SimpleInput = () => {
  const emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // Custom hook champ "name"
  const {
    value: enteredName,
    isValid: nameInputIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value: string) => value.trim() !== "");

  // Custom hook champ "email"
  const {
    value: enteredEmail,
    isValid: emailInputIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    (value: string) => value.trim() !== "" && emailExpression.test(value)
  );

  let formIsValid = false; // ok car on utilise des states donc réévaluée à chaque modification d'un state

  // Ajouter ici tous les champs à contrôler
  if (nameInputIsValid && emailInputIsValid) {
    formIsValid = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nameInputIsValid || !emailInputIsValid) {
      return;
    }

    console.log(enteredName);
    console.log(enteredEmail);

    resetNameInput();
    resetEmailInput();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div
        className={nameInputHasError ? "form-control invalid" : "form-control"}
      >
        <label htmlFor="name">Your name</label>
        <input
          type="text"
          id="name"
          value={enteredName}
          onChange={nameChangedHandler}
          onBlur={nameBlurHandler}
        />
        {nameInputHasError && (
          <p className="error-text">Name must not be empty !</p>
        )}
      </div>
      <div
        className={emailInputHasError ? "form-control invalid" : "form-control"}
      >
        <label htmlFor="email">Your email</label>
        <input
          value={enteredEmail}
          type="email"
          id="email"
          onChange={emailChangedHandler}
          onBlur={emailBlurHandler}
        />
        {emailInputHasError && (
          <p className="error-text">Email must be a valid email !</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};
