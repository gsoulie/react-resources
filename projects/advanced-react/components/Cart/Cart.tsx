import { Item } from "../../store/cart-slice";
import { Card } from "../UI/Card";
import "./Cart.css";
import { CartItem } from "./CartItem";
import { useSelector } from "react-redux";

export const Cart = () => {
  const items = useSelector((state) => state.cartReducer.items);

  return (
    <Card className="cart">
      <h2>Your Shopping Cart</h2>
      <ul>
        {items.map((item: Item) => (
          <CartItem
            key={item.id}
            item={{
              id: item.id,
              title: item.name,
              quantity: item.qte,
              total: item.totalPrice,
              price: item.price,
            }}
          />
        ))}
      </ul>
    </Card>
  );
};
