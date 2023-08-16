import { cartSliceActions } from "./cart-slice";
import { NotificationStatus, uiSliceActions } from "./ui-slice";

const FIREBASE_URL = '<YOUR-FIREBASE-URL>.firebasedatabase.app'

/**
 * === ACTION CREATOR ===
 * @param cart 
 * @returns 
 */

export const fetchCartData = () => {
  return async dispatch => {
    // Fonction de récupération des data dans le backend Firebase
    const fetchDataFromFirebase = async () => {
      const response = await fetch(`${FIREBASE_URL}/cart.json`);

      if (!response.ok) {
        throw new Error('Could not fetch data from Firebase');
      }

      const data = await response.json();

      return data;
    }

    try {
      const cartData = await fetchDataFromFirebase();

      // Mise à jour du dataset avec les données du backend
      dispatch(cartSliceActions.replaceCart({
        items: cartData.items || [],
        totalQte: cartData.totalQte
      }));

    } catch (err) {
      // Affcihage d'une notification via une action
      dispatch(
        uiSliceActions.showNotification({
          status: NotificationStatus.error,
          title: "Http Error",
          message: "Fetching cart data failed !",
        })
      );
    }

  }
}

/**
 * Mettre à jour les données du backend
**/
export const sendCartData = (cart) => {
  return async (dispatch) => {
    // Affichage d'un loader
    dispatch(
      uiSliceActions.showNotification({
        status: NotificationStatus.pending,
        title: "Sending cart data...",
      })
    );

    // Envoi de la requête au backend
    const sendRequest = async () => {
      const response = await fetch(
        `${FIREBASE_URL}/cart.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQte: cart.totalQte
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Sending cart data failed !");
      }
    }
    try {
      await sendRequest();
      // Notification de succes
      dispatch(
        uiSliceActions.showNotification({
          status: NotificationStatus.success,
          title: "Success !",
          message: "Sending cart data successfully !",
        })
      );
    } catch (e) {
      dispatch(
        uiSliceActions.showNotification({
          status: NotificationStatus.error,
          title: "Http Error",
          message: "Sending cart data failed !",
        })
      );
    }
  }
}

// Ecriture alternative

// export const sendCartData = createAsyncThunk(
//   'cart/sendCartData',
//   async (cart, { dispatch }) => {
//     try {
//       dispatch(
//         uiSliceActions.showNotification({
//           status: NotificationStatus.pending,
//           title: "Sending cart data...",
//         })
//       );

//       const sendRequest = async () => {
//         const response = await fetch(
//           "https://www",
//           {
//             method: "PUT",
//             body: JSON.stringify(cart),
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Sending cart data failed !");
//         }
//       };

//       await sendRequest();

//       dispatch(
//         uiSliceActions.showNotification({
//           status: NotificationStatus.success,
//           title: "Success !",
//           message: "Sending cart data successfully !",
//         })
//       );
//     } catch (error) {
//       dispatch(
//         uiSliceActions.showNotification({
//           status: NotificationStatus.error,
//           title: "Http Error",
//           message: "Sending cart data failed !",
//         })
//       );
//       throw error;
//     }
//   }
// );
