// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import store from "./store/store.js";
import {
  Login,
  SignUp,
  AuthLayout,
  Dashboard,
  BoardPage,
  SettingsPage,
} from "./components";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <SignUp /> },
      {
        path: "/dashboard",
        element: (
          <AuthLayout>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "/board/:id",
        element: (
          <AuthLayout>
            <BoardPage />
          </AuthLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthLayout>
            <SettingsPage />
          </AuthLayout>
        ),
      },
      { path: "*", element: <Navigate to="/dashboard" /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>,
);
