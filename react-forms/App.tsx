import "./App.css";
import { BasicForm } from "./components/BasicForm";
import { SimpleInput } from "./components/SimpleInput";

function App() {
  return (
    <>
      <div className="app">
        <h2>Validation basique avec custom hook</h2>
        <SimpleInput />
      </div>
      <div className="app">
        <h2>Form avec custom hook utilisant useReducer</h2>
        <BasicForm />
      </div>
    </>
  );
}

export default App;
