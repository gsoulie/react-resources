import { uiSliceActions } from "../../store/ui-slice";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";

export const CartButton = (props) => {
  const dispatch = useDispatch();
  const totalQte = useSelector((state) => state.cartReducer.totalQte);

  const cartButtonHandler = () => {
    dispatch(uiSliceActions.toggleCart());
  };

  return (
    <button className="button" onClick={cartButtonHandler}>
      <span>My Cart</span>
      <span className="badge">{totalQte}</span>
    </button>
  );
};
