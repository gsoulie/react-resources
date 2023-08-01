import { StateType, counterActions } from "../../store/counter-slice";
import "./Counter.css";
import { useSelector, useDispatch } from "react-redux";

export const Counter = () => {
  const counterState: StateType = useSelector((state) => state.counterReducer);

  const dispatch = useDispatch();

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggle());
  };

  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };

  const incrementByFiveHandler = () => {
    dispatch(counterActions.incrementByValue(5));
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  return (
    <main className="counter">
      <h1>Redux Counter</h1>
      {counterState.toggle && (
        <div className="value">{counterState.counter}</div>
      )}

      <button onClick={toggleCounterHandler}>Toggle Counter</button>

      {counterState.toggle && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={incrementHandler}>Increment</button>&nbsp;
          <button onClick={decrementHandler}>Decrement</button>&nbsp;
          <button onClick={incrementByFiveHandler}>Increment +5</button>
        </div>
      )}
    </main>
  );
};
