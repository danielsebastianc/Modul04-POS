import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { user } from "./user";
import { cart } from "./cart";

export const globalStore = configureStore({
  reducer: {
    user,
    cart,
  },
});
