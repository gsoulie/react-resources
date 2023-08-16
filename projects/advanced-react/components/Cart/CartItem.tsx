import { Item, cartSliceActions } from "../../store/cart-slice";
import "./Cart.css";
import { useDispatch } from "react-redux";

export const CartItem = (props) => {
  const { id, title, quantity, total, price } = props.item;
  const dispatch = useDispatch();

  const addItemHandler = () => {
    const newItem: Item = {
      id,
      name: title,
      price,
    };
    dispatch(cartSliceActions.addItemToCart(newItem));
  };
  const removeItemHandler = () => {
    dispatch(cartSliceActions.removeItemToCart(id));
  };

  return (
    <li className="item">
      <header>
        <h3>{title}</h3>
        <div className="price">
          ${total?.toFixed(2)}{" "}
          <span className="itemprice">(${price.toFixed(2)}/item)</span>
        </div>
      </header>
      <div className="details">
        <div className="quantity">
          x <span>{quantity}</span>
        </div>
        <div className="actions">
          <button onClick={removeItemHandler}>-</button>
          <button onClick={addItemHandler}>+</button>
        </div>
      </div>
    </li>
  );
};
