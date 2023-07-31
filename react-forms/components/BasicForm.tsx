import useInputWithReducer from "../hooks/use-input-with-reducer";

export const BasicForm = () => {
  const emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const {
    value: enteredFirstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFistName,
  } = useInputWithReducer((value) => value.trim() !== "");

  const {
    value: enteredLastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInputWithReducer((value) => value.trim() !== "");

  const {
    value: enteredEmailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInputWithReducer(
    (value) => value.trim() !== "" && emailExpression.test(value)
  );

  const formIsValid = firstNameIsValid && lastNameIsValid && emailIsValid;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formIsValid) {
      return;
    }

    resetFistName();
    resetLastName();
    resetEmail();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="control-group">
        <div
          className={
            firstNameHasError ? "form-control invalid" : "form-control"
          }
        >
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={enteredFirstNameValue}
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
          />
          {firstNameHasError && (
            <p className="error-text">Name must not be empty !</p>
          )}
        </div>

        <div
          className={lastNameHasError ? "form-control invalid" : "form-control"}
        >
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={enteredLastNameValue}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
          />
          {lastNameHasError && (
            <p className="error-text">Lastname must not be empty !</p>
          )}
        </div>
      </div>
      <div className={emailHasError ? "form-control invalid" : "form-control"}>
        <label htmlFor="email">E-Mail Address</label>
        <input
          type="text"
          id="email"
          value={enteredEmailValue}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailHasError && (
          <p className="error-text">Email must be a valid email !</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};
