import { configureStore } from "@reduxjs/toolkit";
import { CheckUserLoggedInReducer } from "../AuthStore";

const reducer = {
    CheckUserLoggedInReducer,
};

export const store = configureStore({
  reducer: reducer,
});

