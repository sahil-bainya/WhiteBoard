import { StrictMode } from "react";
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
import { AuthLayout } from "./components";
import { AuthPage, BoardPage, DashboardPage, SettingsPage } from "./pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" /> },
      { path: "/login", element: <AuthPage /> },
      { path: "/register", element: <AuthPage /> },
      {
        path: "/dashboard",
        element: (
          <AuthLayout>
            <DashboardPage />
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
      { path: "*", element: <Navigate to="/login" /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
