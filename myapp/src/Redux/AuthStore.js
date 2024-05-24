import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: true,
};

export const CheckUserLoggedInSlice = createSlice({
  name: "Authentication",
  initialState: initialState,
  reducers: {
    loginSuccess: (state) => {
      state.loggedIn = true;
    },
    loginFailure: (state) => {
      state.loggedIn = false;
    },
  },
});




export const CheckUserLoggedInReducer = CheckUserLoggedInSlice.reducer;

export const CheckUserLoggedInactions = CheckUserLoggedInSlice.actions;

export const CheckUserLoggedInSelector = (state) => state.CheckUserLoggedInReducer;




