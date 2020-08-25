import _ from "lodash";
import createDataContext from "./createDataContext";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "update_item_in_cart":
      let newItems = 0;
      const newCartState = state.cart.map((item, i) => {
        if (item.id === action.payload.id) {
          newItems += action.payload.quantity;
          return Object.assign(item, action.payload);
        } else {
          newItems += item.quantity;
          return item;
        }
      });
      return { cart: newCartState, items: newItems };
    case "add_to_cart":
      return {
        cart: [...state.cart, action.payload],
        items: state.items + action.payload.quantity,
      };
    default:
      return state;
  }
};

const updateItemInCart = (dispatch) => async (product) => {
  dispatch({ type: "update_item_in_cart", payload: product });
};

const addToCart = (dispatch) => async (product) => {
  dispatch({ type: "add_to_cart", payload: product });
};

export const { Context, Provider } = createDataContext(
  cartReducer,
  { updateItemInCart, addToCart },
  { cart: [], items: 0 }
);
