import { useSelector } from "react-redux";
import "./App.css";
import { Auth } from "./components/auth/Auth";
import { Counter } from "./components/counter/Counter";
import { Header } from "./components/header/Header";
import { UserProfile } from "./components/user/UserProfile";

function App() {
  const isAuth = useSelector(
    (state: { authReducer: any; counterReducer: any }) =>
      state.authReducer.isAuthenticated
  );

  return (
    <>
      <Header />
      {!isAuth && <Auth />}
      {isAuth && <UserProfile />}
      <Counter />
    </>
  );
}

export default App;
