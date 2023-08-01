import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { authActions } from "../../store/auth-slice";
export const Header = () => {
  const isAuth = useSelector(
    (state: { authReducer: any; counterReducer: any }) =>
      state.authReducer.isAuthenticated
  );

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <header className="header">
      <h1>Redux Auth</h1>
      {isAuth && (
        <nav>
          <ul>
            <li>
              <a href="/">My Products</a>
            </li>
            <li>
              <a href="/">My Sales</a>
            </li>
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
