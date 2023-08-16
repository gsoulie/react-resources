import { CartButton } from "../Cart/CartButton";
import "./MainHeader.css";

export const MainHeader = () => {
  return (
    <header className="header">
      <h1>ReduxCart</h1>
      <nav>
        <ul>
          <li>
            <CartButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};
