import { Item, cartSliceActions } from "../../store/cart-slice";
import { Card } from "../UI/Card";
import "./Product.css";
import { useDispatch } from "react-redux";

export const ProductItem = (props) => {
  const { id, title, price, description } = props;
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    const newItem: Item = {
      id,
      name: title,
      price,
      // qte: 1,
      totalPrice: price,
    };

    dispatch(cartSliceActions.addItemToCart(newItem));
  };

  return (
    <li className="item">
      <Card>
        <header>
          <h3>{title}</h3>
          <div className="price">${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className="actionsButton">
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};
