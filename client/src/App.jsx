import "./App.css";
import { Header } from "./components";
import { Outlet } from "react-router-dom";
import api from "./services/api";
import store from "./store/store.js";
import { setUser, clearUser } from "./store/authSlice.js";
api
  .get("/user/get-user")
  .then((res) => {
    store.dispatch(setUser(res.data.data));
  })
  .catch(() => {
    store.dispatch(clearUser());
  });
function App() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
