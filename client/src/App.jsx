import "./App.css";
import { Header } from "./components";
import { Outlet, useLocation } from "react-router-dom";
import api from "./services/api";
import { setUser, clearUser } from "./store/authSlice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function App() {
  const location = useLocation(); // gives the current url
  const dispatch = useDispatch();
  useEffect(() => {
    api
      .get("/user/get-user")
      .then((res) => {
        dispatch(setUser(res.data.data));
      })
      .catch(() => {
        dispatch(clearUser());
      });
  }, [dispatch]);

  const hideNavbar =
    location.pathname.startsWith("/board") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  return (
    <div>
      {!hideNavbar && <Header />}
      <Outlet />
    </div>
  );
}

export default App;
