export const addCartItem = (data) => {
  return {
    type: "ADD_CART_ITEM",
    payload: data,
  };
};
export const clearCart = (data) => {
  return {
    type: "CLEAR_CART",
  };
};
