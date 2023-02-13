const INITIAL_STATE = {
  cart: [],
};

export const cart = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_CART_ITEM":
      return { ...state, cart: [...state.cart, action.payload] };
    case "CLEAR_CART":
      return INITIAL_STATE;
    default:
      return state;
  }
};
