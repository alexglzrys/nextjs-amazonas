import { createContext, useReducer } from "react";

// Crear el contexto (Almacen de información)
export const Store = createContext();

// Crear el estado inicial de la aplicación
const initialState = {
  cart: {
    cartItems: [],
  },
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
      return { ...state, cart: { ...state.cart, cartItems } };
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
