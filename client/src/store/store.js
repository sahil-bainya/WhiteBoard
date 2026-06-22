import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import boardReducer from "./boardSlice.js";
import themeReducer from "./themeSlice.js";
const store = configureStore({
  reducer: { auth: authReducer, board: boardReducer, theme: themeReducer },
});

export default store;
