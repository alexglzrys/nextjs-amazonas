import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

// Crear el contexto (Almacen de información)
export const Store = createContext();

// Crear el estado inicial de la aplicación
// Su usa el paradigma de cookies en lugar de LocalStorage para persistir información en el cliente
const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [] },
};

// Crear el Reducer (Acciones o tareas)
function reducer(state, action) {
  switch (action.type) {
    // Agregar al carrito de la compra
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      // Almacenar cambios en la Cookie
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      // Devolver el estado actualizado en esta acción como de costumbre
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      // Filtrar productos para remover el item seleccionado
      const cartItems = state.cart.cartItems.filter(
        (productState) => productState.slug !== action.payload.slug
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_RESET': 
      // Limpiar el carrtiro de la compra (logout) 
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {}},
          paymentMethod: '',
        }
      }
    default:
      return state;
  }
}

// Crear el Provider ()
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
