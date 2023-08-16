import { useEffect } from "react";
import "./App.css";
import { Cart } from "./components/Cart/Cart";
import { Layout } from "./components/Layout/Layout";
import { Products } from "./components/Shop/Products";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "./components/UI/Notification";
import { AppDispatch } from "./store";
import { fetchCartData, sendCartData } from "./store/cart-action";

// TIPS : variable HORS du composant (donc ne sera pas réinitialisée lors d'un rendu)
// permettant de détecter le tout premier rendu et ainsi ne pas envoyer une requête à firebase
// au premier chargement
let initialRender = true;

function App() {
  const cartIsVisible = useSelector((state) => state.uiReducer.cartVisible);
  const notification = useSelector((state) => state.uiReducer.notification);
  const cart = useSelector((state) => state.cartReducer);

  const dispatch = useDispatch<AppDispatch>(); // typage nécessaire pour éviter une erreur typescript

  // Effect pour charger les data
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // Effect pour mettre à jour les data à chaque modification du store
  useEffect(() => {
    // Empêcher l'appel à firebase lors du premier rendu
    if (initialRender) {
      initialRender = false;
      return;
    }

    // test pour éviter une boucle infinie entre les 2 UseEffect
    if (cart.changed) {
      // Dispatch Action creator
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
