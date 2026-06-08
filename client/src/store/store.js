import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import boardReducer from "./boardSlice.js";
const store = configureStore({
  reducer: { auth: authReducer, board: boardReducer },
});

export default store;
